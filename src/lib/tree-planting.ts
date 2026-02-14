interface TreePlantingResponse {
  success: boolean;
  treeId?: string;
  message?: string;
}

interface UserEmailData {
  email: string;
  name: string;
  starName: string;
  constellation: string;
  treesPlanted: number;
}

export class TreePlantingService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly isEnabled: boolean;

  constructor() {
    this.apiKey = process.env.THEGOOD_API_KEY || '';
    this.apiUrl = 'https://api.thegoodapi.com/v1/trees';
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.TREE_PLANTING_ENABLED === 'true';
  }

  async plantTree(): Promise<TreePlantingResponse> {
    if (!this.isEnabled) {
      console.log('Tree planting disabled - not in production or test mode');
      return { success: true, message: 'Tree planting disabled in development' };
    }

    if (!this.apiKey) {
      console.error('THEGOOD_API_KEY not configured');
      return { success: false, message: 'API key not configured' };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'MidnightTyper/1.0'
        },
        body: JSON.stringify({
          project_id: 'midnight-typer-forest',
          species: 'mixed-native',
          location: {
            country: 'Global',
            region: 'Various reforestation projects'
          },
          metadata: {
            source: 'midnight-typer',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        treeId: result.id || result.tree_id,
        message: 'Tree planted successfully'
      };
    } catch (error) {
      console.error('Error planting tree:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async sendCelebrationEmail(userData: UserEmailData): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Email sending disabled - not in production or test mode');
      return true;
    }

    try {
      // This would integrate with your email service (SendGrid, Mailgun, etc.)
      const response = await fetch('/api/send-impact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userData.email,
          template: 'tree_planted_celebration',
          data: {
            name: userData.name,
            starName: userData.starName,
            constellation: userData.constellation,
            treesPlanted: userData.treesPlanted,
            date: new Date().toLocaleDateString()
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending celebration email:', error);
      return false;
    }
  }
}

export const treePlantingService = new TreePlantingService();