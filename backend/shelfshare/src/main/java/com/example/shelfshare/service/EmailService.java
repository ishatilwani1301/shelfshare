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

    public void sendBorrowRequestAcceptedEmail(Integer ownerUserId, Integer requesterUserId, Integer bookId) {
        var owner = userRepository.findById(ownerUserId).get();
        var requester = userRepository.findById(requesterUserId).get();
        var book = booksRepository.findById(bookId).get();

        // Email to the Requester
        try {
            MimeMessage messageToRequester = mailSender.createMimeMessage();
            MimeMessageHelper helperToRequester = new MimeMessageHelper(messageToRequester, true, "UTF-8");

            helperToRequester.setFrom(senderEmail);
            helperToRequester.setTo(requester.getUserEmail());
            helperToRequester.setSubject("Your Borrow Request for '" + book.getBookTitle() + "' has been Accepted!");

            String htmlContentRequester = buildBorrowRequestAcceptedEmailContentForRequester(
                requester.getName(),
                owner.getName(),
                owner.getUserEmail(), // Pass owner's email to requester
                book.getBookTitle()
            );
            helperToRequester.setText(htmlContentRequester, true);
            mailSender.send(messageToRequester);

            System.out.println("Borrow request accepted email sent to requester: " + requester.getUserEmail());
        } catch (Exception e) {
            System.err.println("Failed to send borrow request accepted email to requester: " + requester.getUserEmail());
            e.printStackTrace();
        }

        // Email to the Owner
        try {
            MimeMessage messageToOwner = mailSender.createMimeMessage();
            MimeMessageHelper helperToOwner = new MimeMessageHelper(messageToOwner, true, "UTF-8");

            helperToOwner.setFrom(senderEmail);
            helperToOwner.setTo(owner.getUserEmail());
            helperToOwner.setSubject("Your have accepted the Borrow Request for '" + book.getBookTitle() + "' !");

            String htmlContentOwner = buildBorrowRequestAcceptedEmailContentForOwner(
                owner.getName(),
                requester.getName(),
                requester.getUserEmail(), // Pass requester's email to owner
                book.getBookTitle()
            );
            helperToOwner.setText(htmlContentOwner, true);
            mailSender.send(messageToOwner);

            System.out.println("Borrow request accepted email sent to owner: " + owner.getUserEmail());
        } catch (Exception e) {
            System.err.println("Failed to send borrow request accepted email to owner: " + owner.getUserEmail());
            e.printStackTrace(); // It's good practice to print the stack trace for debugging
        }
    }

    private String buildBorrowRequestAcceptedEmailContentForRequester(String requesterName, String ownerName, String ownerEmail, String bookTitle) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>");
        content.append("<p>Dear ").append(requesterName).append(",</p>");
        content.append("<p>Great news! Your request to borrow <strong>").append(bookTitle).append("</strong> from ").append(ownerName).append(" has been ACCEPTED!</p>");
        content.append("<p>You can now connect with ").append(ownerName).append(" to arrange the exchange of the book.</p>");
        content.append("<p>Here's how to connect:</p>");
        content.append("<ul>");
        content.append("<li><strong>Owner's Email:</strong> <a href=\"mailto:").append(ownerEmail).append("\">").append(ownerEmail).append("</a></li>");
        content.append("<li><strong>Google Chat:</strong> You can reach them via Google Chat using their email address. Just open Google Chat and start a new conversation with ").append(ownerEmail).append(".</li>");
        content.append("</ul>");
        content.append("<p>Please coordinate with ").append(ownerName).append(" directly regarding the pickup/delivery of the book.</p>");
        content.append("<p>Happy Reading!</p>");
        content.append("<p>Best regards,</p>");
        content.append("<p>The ShelfShare Team</p>");
        content.append("<p><small>This is an automated email, please do not reply.</small></p>");
        content.append("</body></html>");
        return content.toString();
    }

    private String buildBorrowRequestAcceptedEmailContentForOwner(String ownerName, String requesterName, String requesterEmail, String bookTitle) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>");
        content.append("<p>Dear ").append(ownerName).append(",</p>");
        content.append("<p>You've successfully accepted the borrow request for your book <strong>").append(bookTitle).append("</strong> from ").append(requesterName).append(".</p>");
        content.append("<p>You can now connect with ").append(requesterName).append(" to arrange the exchange of the book.</p>");
        content.append("<p>Here's how to connect:</p>");
        content.append("<ul>");
        content.append("<li><strong>Requester's Email:</strong> <a href=\"mailto:").append(requesterEmail).append("\">").append(requesterEmail).append("</a></li>");
        content.append("<li><strong>Google Chat:</strong> You can reach them via Google Chat using their email address. Just open Google Chat and start a new conversation with ").append(requesterEmail).append(".</li>");
        content.append("</ul>");
        content.append("<p>Please coordinate with ").append(requesterName).append(" directly regarding the pickup/delivery of the book.</p>");
        content.append("<p>Thank you for sharing!</p>");
        content.append("<p>Best regards,</p>");
        content.append("<p>The ShelfShare Team</p>");
        content.append("<p><small>This is an automated email, please do not reply.</small></p>");
        content.append("</body></html>");
        return content.toString();
    }
}
