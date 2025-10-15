export const emailTemplateGlobalStyle = `
body {
  background-color: #f9fafb;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid #eee;
}

.header {
  background: #2563eb;
  color: white;
  padding: 20px;
  text-align: center;
}

.content {
  padding: 25px;
}

.content h2 {
  margin-top: 0;
  color: #111827;
}

.info {
  margin: 20px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 15px 0;
}

.info p {
  margin: 6px 0;
  font-size: 15px;
}

.label {
  font-weight: bold;
  color: #374151;
}

.message-box {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-line;
  font-size: 15px;
  line-height: 1.5;
}

.message-container {
  display: grid;
  align-content: flex-start;
  gap: 8px;
  padding: 16px;
}

.message-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  margin-bottom: 16px;
}

.message-card-bubble {
  width: 16px;
  height: 16px;
  background-color: #2563eb;
  border-radius: 50%;
}

.message-card-content {
  flex: 1;
  margin-left: 8px;
}

.message-card-content p {
  margin: 0;
  font-size: 15px;
  color: #374151;
}

.message-card-content .timestamp {
  margin-top: 4px;
  font-size: 13px;
  color: #9ca3af;
}

.footer {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  padding: 15px 0;
  background: #f9fafb;
}
      `

export const newCustomerContactHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>

  <style>
  ${emailTemplateGlobalStyle}
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>📩 New Message Received</h1>
    </div>

    <div class="content">
      <h2>Contact Details</h2>
      <div class="info">
        <p><span class="label">Full Name:</span> {{fullname}}</p>
        <p><span class="label">Email:</span> {{email}}</p>
        <p><span class="label">Phone:</span> {{phone}}</p>
      </div>

      <h3>Message</h3>
      <div class="message-box">
        {{message}}
      </div>
    </div>

    <div class="footer">
      <p>This message was sent from your website contact form.</p>
    </div>
  </div>
</body>
</html>
`