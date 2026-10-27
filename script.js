const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const business = document.getElementById("businessType").value;
    const message = document.getElementById("message").value.trim();

    const recipient =
      business === "Agriculture"
        ? "himanshuverma44363@gmail.com"
        : "indianopq7@gmail.com";

    const subject = encodeURIComponent(
      business + " enquiry from " + name
    );

    const body = encodeURIComponent(
      "Name: " + name + "\n" +
      "Customer email: " + email + "\n" +
      "Business: " + business + "\n\n" +
      "Message:\n" + message
    );

    window.location.href =
      "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
  });
}