const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  static async analyzeTask(title, description = '') {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured');
        return this.getFallbackAnalysis();
      }

      const prompt = `Analyze this task and provide insights:
        Title: ${title}
        Description: ${description || 'No description provided'}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      
      return {
        suggestedPriority: this.mapPriority(parsed.suggestedPriority),
        reasoning: parsed.reasoning,
        estimatedEffort: parsed.estimatedEffort,
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      console.error('OpenAI Service Error:', error.message);
      return this.getFallbackAnalysis();
    }
  }

  static getFallbackAnalysis() {
    return {
      suggestedPriority: 'medium',
      reasoning: 'AI analysis unavailable. Default priority assigned based on standard task categorization.',
      estimatedEffort: '2-4 hours',
      recommendations: [
        'Break down into smaller, manageable subtasks',
        'Set clear milestones and deadlines',
        'Review and adjust priority as needed'
      ]
    };
  }

  static mapPriority(priority) {
    const normalized = priority.toLowerCase();
    if (normalized.includes('urgent')) return 'urgent';
    if (normalized.includes('high')) return 'high';
    if (normalized.includes('low')) return 'low';
    return 'medium';
  }
}

module.exports = { OpenAIService };

