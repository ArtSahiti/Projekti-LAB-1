package com.erinart.HotelB.service;

import com.erinart.HotelB.dto.EmailRequest;
import com.erinart.HotelB.entity.Email;
import com.erinart.HotelB.repo.EmailRepository;
import com.erinart.HotelB.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailRepository emailRepository;
    private final JavaMailSender javaMailSender;

    public String sendEmail(EmailRequest emailRequest) {
        try {
            // Retrieve the email of the logged-in user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String loggedInUserEmail = authentication.getName(); // Get the logged-in user's email

            // Generate the booking confirmation code using the utility method
            String confirmationCode = Utils.generateRandomConfirmationCode(8); // Call the utility method

            // Prepare email content with confirmation code
            String emailBody = emailRequest.getBody();

            // Create email message
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setTo(loggedInUserEmail);  // Use logged-in user's email
            simpleMailMessage.setSubject(emailRequest.getSubject());
            simpleMailMessage.setText(emailBody);  // Send email with confirmation code in the body
            javaMailSender.send(simpleMailMessage);  // Send the email

            // Save to database
            Email emailToSave = new Email();
            emailToSave.setRecipient(loggedInUserEmail);  // Save the recipient as the logged-in user's email
            emailToSave.setSubject(emailRequest.getSubject());
            emailToSave.setBody(emailBody);  // Save the email body with the confirmation code
            emailRepository.save(emailToSave);  // Save the email to the database

            return "Email successfully sent to the logged-in user with confirmation code";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}