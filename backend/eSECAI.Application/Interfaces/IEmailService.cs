
namespace esecai.Application.Interfaces;

public interface IEmailService
{
  Task SendOtpEmailAsync(string toEmail, string otpCode);
}