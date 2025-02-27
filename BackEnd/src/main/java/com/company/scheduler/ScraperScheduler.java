package com.company.scheduler;

import com.company.service.ScraperService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScraperScheduler {

    private final ScraperService scraperService;

    public ScraperScheduler(ScraperService scraperService) {
        this.scraperService = scraperService;
    }

    @Scheduled(fixedRate = 10800000) // 3시간마다 실행
    public void runScraper() {
        scraperService.scrapeAndSave();
    }
}
