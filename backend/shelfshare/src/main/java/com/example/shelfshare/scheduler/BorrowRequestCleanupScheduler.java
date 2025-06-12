package com.example.shelfshare.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.shelfshare.service.BookService;

@Component
public class BorrowRequestCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BorrowRequestCleanupScheduler.class);
    private final BookService bookService;

    public BorrowRequestCleanupScheduler(BookService bookService) {
        this.bookService = bookService;
    }

    @Scheduled(fixedRate=3600000)
    public void rejectExpiredBorrowRequests() {
        logger.info("Running scheduled task to reject expired borrow requests");
        bookService.rejectExpiredBorrowRequests();
        logger.info("Finished scheduled task to reject expired borrow requests");
    }

}
