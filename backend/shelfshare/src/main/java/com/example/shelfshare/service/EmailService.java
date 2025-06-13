package com.example.shelfshare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.shelfshare.repository.BooksRepository;
import com.example.shelfshare.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private final UserRepository userRepository;

    private final BooksRepository booksRepository;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(UserRepository userRepository, BooksRepository booksRepository) {
        this.userRepository = userRepository;
        this.booksRepository = booksRepository;
    }

    public void sendWelcomeEmail(Integer userId) {
        var userOptional = userRepository.findById(userId);
        var user = userOptional.get();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(user.getUserEmail());
            helper.setSubject("Welcome to ShelfShare!");

            String htmlContent = buildWelcomeEmailContent(user.getName());
            helper.setText(htmlContent, true);
            mailSender.send(message);

            System.out.println("Welcome email sent successfully to:"+user.getUserEmail());
        }catch(Exception e) {
            System.err.println("Failed to send welcom email to:"+user.getUserEmail());
        }

    }

    private String buildWelcomeEmailContent(String username) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>");
        content.append("<p>Dear ").append(username).append(",</p>");
        content.append("<p>Welcome to <strong>ShelfShare</strong>! We're thrilled to have you join our community of book lovers.</p>");
        content.append("<p>ShelfShare is the perfect place to:</p>");
        content.append("<ul>");
        content.append("<li><strong>Share your books:</strong> List books you're willing to lend or give away.</li>");
        content.append("<li><strong>Discover new reads:</strong> Browse books shared by others in your community.</li>");
        content.append("<li><strong>Explore anonymous books:</strong> Discover books selected based on intriguing notes and descriptions from other users!</li>");
        content.append("</ul>");
        content.append("<p>To get started, here are a few things you can do:</p>");
        content.append("<ol>");
        content.append("<li><a href=\"http://localhost:1234/dashboard\"><strong>Explore the Dashboard</strong></a>: See what's new and happening.</li>");
        content.append("<li><a href=\"http://localhost:1234/my-books/add\"><strong>Add Your First Book</strong></a>: Start sharing your collection.</li>");
        content.append("<li><a href=\"http://localhost:1234/browse\"><strong>Browse Available Books</strong></a>: Find your next favorite read.</li>");
        content.append("</ol>");
        content.append("<p>If you have any questions, feel free to visit our <a href=\"http://localhost:1234/faq\">FAQ page</a> or contact our support team.</p>");
        content.append("<p>Happy Reading and Sharing!</p>");
        content.append("<p>Best regards,</p>");
        content.append("<p>The ShelfShare Team</p>");
        content.append("<p><small>This is an automated email, please do not reply.</small></p>");
        content.append("</body></html>");
        return content.toString();
    }
    
    public void sendBorrowRequestReceivedEmail(Integer ownerUserId, Integer requesterUserId, Integer bookId) {
        var owner = userRepository.findById(ownerUserId).get();
        var requester = userRepository.findById(requesterUserId).get();
        var book = booksRepository.findById(bookId).get();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(owner.getUserEmail());
            helper.setSubject("New Borrow Request for your Book: "+book.getBookTitle());

            String htmlContent = buildBorrowRequestReceivedEmailContent(owner.getName(), requester.getName(), book.getBookTitle());
            helper.setText(htmlContent, true);
            mailSender.send(message);

            System.out.println("Borrow request email sent successfully to:"+owner.getUserEmail());
        }catch(Exception e) {
            System.err.println("Failed to send Borrow request email to:"+owner.getUserEmail());
        }
    }

    private String buildBorrowRequestReceivedEmailContent(String ownerName, String requesterName, String bookTitle) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>");
        content.append("<p>Dear ").append(ownerName).append(",</p>");
        content.append("<p>Good news! You've received a new borrow request on ShelfShare!</p>");
        content.append("<p>");
        content.append("<strong>").append(requesterName).append("</strong> is interested in borrowing your book: ");
        content.append("<strong>").append(bookTitle).append("</strong>.");
        content.append("</p>");
        content.append("<p>Here’s what you can do next:</p>");
        content.append("<ol>");
        content.append("<li><a href=\"http://localhost:1234/my-requests\"><strong>View the Request</strong></a>: Go to your 'My Requests' section to see details and respond.</li>");
        content.append("<li><strong>Connect with the Requester</strong>: ShelfShare provides tools for you to communicate directly with ").append(requesterName).append(" to arrange the exchange.</li>");
        content.append("</ol>");
        content.append("<p>We recommend responding to borrow requests promptly to keep our community active and vibrant.</p>");
        content.append("<p>Happy Sharing!</p>");
        content.append("<p>Best regards,</p>");
        content.append("<p>The ShelfShare Team</p>");
        content.append("<p><small>This is an automated email, please do not reply.</small></p>");
        content.append("</body></html>");
        return content.toString();
    }
}
