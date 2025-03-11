import { Injectable } from '@angular/core';
import { Ticket } from '../data/models/ticket.model';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators';

interface HrRecommendation {
  userId: string;
  username: string;
  confidenceScore: number;
  reason: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  // Define expertise areas for different HR specialists
  private hrExpertise: Record<string, string[]> = {
    // Will be populated from user service
  };

  constructor(private userService: UserService) {
    // Initialize HR expertise data
    this.loadHrExpertiseData();
  }

  private loadHrExpertiseData() {
    this.userService.getHrUsers().subscribe((hrUsers) => {
      // Map of keywords to expertise areas
      const expertiseKeywords: Record<string, string[]> = {
        payroll: [
          'salary',
          'payment',
          'compensation',
          'bonus',
          'pay',
          'wage',
          'deduction',
        ],
        benefits: [
          'insurance',
          'health',
          'dental',
          'vision',
          'retirement',
          '401k',
          'benefit',
        ],
        technical: [
          'laptop',
          'computer',
          'software',
          'hardware',
          'access',
          'account',
          'portal',
        ],
        general: ['question', 'information', 'update', 'change', 'request'],
        facilities: [
          'office',
          'building',
          'desk',
          'chair',
          'equipment',
          'workspace',
        ],
      };

      // Randomly assign expertise areas to HR users for demo
      // In a real system, this would be based on actual user profiles
      hrUsers.forEach((user) => {
        // Choose 1-2 random expertise areas for each HR rep
        const areas = Object.keys(expertiseKeywords);
        const assigned = [];

        // Assign at least one area
        const primaryArea = areas[Math.floor(Math.random() * areas.length)];
        assigned.push(primaryArea);

        // 50% chance to assign a second area
        if (Math.random() > 0.5) {
          const remainingAreas = areas.filter((a) => a !== primaryArea);
          const secondaryArea =
            remainingAreas[Math.floor(Math.random() * remainingAreas.length)];
          assigned.push(secondaryArea);
        }

        this.hrExpertise[user.id] = assigned;
      });
    });
  }

  getRecommendedAssignee(ticket: Ticket): Observable<HrRecommendation[]> {
    return this.userService.getHrUsers().pipe(
      map((hrUsers) => {
        const recommendations: HrRecommendation[] = [];

        // Skip if there are no HR users
        if (!hrUsers.length) return [];

        const ticketText =
          `${ticket.title} ${ticket.description}`.toLowerCase();
        const ticketCategory = ticket.category?.toLowerCase() || '';

        // Analyze each HR rep
        hrUsers.forEach((user) => {
          let confidenceScore = 0;
          let reason = '';

          // Check expertise match with ticket category
          const expertiseAreas = this.hrExpertise[user.id] || [];

          if (
            expertiseAreas.some((area) =>
              ticketCategory.includes(area.toLowerCase())
            )
          ) {
            confidenceScore += 40;
            reason = `Specializes in ${ticketCategory}`;
          }

          // Keyword matching
          expertiseAreas.forEach((area) => {
            const keywords = this.getKeywordsForArea(area.toLowerCase());
            keywords.forEach((keyword) => {
              if (ticketText.includes(keyword)) {
                confidenceScore += 10;
                reason = reason || `Experience with ${area} issues`;
              }
            });
          });

          // Add basic score to ensure everyone gets some rating
          confidenceScore = Math.max(5, Math.min(95, confidenceScore));

          recommendations.push({
            userId: user.id,
            username: user.username,
            confidenceScore,
            reason: reason || 'Available HR representative',
          });
        });

        // Sort by confidence score (highest first)
        return recommendations.sort(
          (a, b) => b.confidenceScore - a.confidenceScore
        );
      }),
      catchError((error) => {
        console.error('Error getting recommended assignees:', error);
        return of([]);
      })
    );
  }

  private getKeywordsForArea(area: string): string[] {
    // Map expertise areas to relevant keywords
    const keywordMap: Record<string, string[]> = {
      payroll: [
        'salary',
        'payment',
        'compensation',
        'bonus',
        'pay',
        'wage',
        'deduction',
      ],
      benefits: [
        'insurance',
        'health',
        'dental',
        'vision',
        'retirement',
        '401k',
        'benefit',
      ],
      technical: [
        'laptop',
        'computer',
        'software',
        'hardware',
        'access',
        'account',
        'portal',
      ],
      general: ['question', 'information', 'update', 'change', 'request'],
      facilities: [
        'office',
        'building',
        'desk',
        'chair',
        'equipment',
        'workspace',
      ],
    };

    return keywordMap[area] || [];
  }
}
