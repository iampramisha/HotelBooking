export const resetPasswordHTMLTemplate = (username: string, resetUrl: string) => `
<div class="bg-gray-100 w-full min-h-screen p-4" style="font-family: 'Nunito Sans', sans-serif;">
  <div class="max-w-xl mx-auto bg-white rounded shadow overflow-hidden">
    <div class="text-center p-6">
      <a href="https://bookit.com" class="text-lg font-bold text-gray-600">BookIT</a>
    </div>

    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Hi ${username},</h1>
      <p class="text-gray-700 mb-4">
        You recently requested to reset your password for your BookIT account. Use the button below to reset it.
        <strong>This password reset is only valid for the next 30 minutes.</strong>
      </p>

      <div class="text-center my-6">
        <a href="${resetUrl}" target="_blank"
       class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded shadow transition">
       Reset your password
    </a>
      </div>

      <p class="text-gray-700 mb-4">
        If you did not request a password reset, please ignore this email or
        <a href="#" class="text-blue-600 underline">contact support</a> if you have questions.
      </p>
      <p class="text-gray-700 mb-6">Thanks,<br>The BookIT team</p>

      <div class="border-t border-gray-300 pt-4 text-gray-600 text-sm">
        <p>If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
        <p class="break-all"><a href="${resetUrl}" class="text-blue-600 underline">${resetUrl}</a></p>
      </div>
    </div>

    <div class="bg-gray-100 text-center p-4 text-gray-500 text-xs">
      BookIT<br>
      1234 Street Rd. <br>
      Suite 1234
    </div>
  </div>
</div>
`;
