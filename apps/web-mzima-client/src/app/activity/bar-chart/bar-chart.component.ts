import { Component, OnInit } from '@angular/core';
import { PostsService } from '@mzima-client/sdk';
import { TranslateService } from '@ngx-translate/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts/lib/utils/color-sets';
import { ManipulateType } from 'dayjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss', '../activity.component.scss'],
})
export class BarChartComponent implements OnInit {
  public data: any[] = [];
  public selectedFilter = 'tags';
  public colorScheme: Color = {
    name: 'Custom color',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFEBBB'],
  };
  public dateRange: ManipulateType;
  public filters: { displayName: string; value: string }[] = [];

  constructor(private postsService: PostsService, private translate: TranslateService) {
    this.initializeFilters();
  }

  public ngOnInit() {
    this.getPostStatistics(this.selectedFilter);
  }

  private initializeFilters() {
    this.filters = [
      { displayName: this.translate.instant('activity.categories'), value: 'tags' },
      { displayName: this.translate.instant('activity.survey'), value: 'form' },
      { displayName: this.translate.instant('activity.status'), value: 'status' },
    ];
  }

  public getPostStatistics(value: any) {
    this.data = [];
    this.postsService.getPostStatistics({ group_by: value }).subscribe({
      next: (response) => {
        this.data = response.result.group_by_total_posts.map((p) => ({
          name: p.label || 'No survey',
          value: p.total,
        }));
      },
    });
  }

  public change(value: string) {
    this.selectedFilter = value;
    this.getPostStatistics(this.selectedFilter);
  }

  public dateChange(date: ManipulateType): void {
    this.dateRange = date;
    this.getPostStatistics(this.selectedFilter);
  }
}
