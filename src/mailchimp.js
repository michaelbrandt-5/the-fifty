// Mailchimp JSONP subscribe — client-side, no backend needed.
// Returns a promise that resolves on success or rejects with an error message.

const MC_URL = "https://thefiftylist.us8.list-manage.com/subscribe/post-json";
const MC_U = "69853d27c066568d5e7b944ab";
const MC_ID = "d54d4bc6e1";
const MC_FID = "00b9d8e2f0";

export function subscribeEmail(email) {
  return new Promise((resolve, reject) => {
    const callbackName = "mc_cb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);

    const params = new URLSearchParams({
      u: MC_U,
      id: MC_ID,
      f_id: MC_FID,
      EMAIL: email,
      c: callbackName,
    });

    const script = document.createElement("script");
    script.src = `${MC_URL}?${params.toString()}`;

    const cleanup = () => {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    window[callbackName] = (data) => {
      cleanup();
      if (data.result === "success") {
        resolve(data.msg);
      } else {
        // Mailchimp returns HTML in error messages — strip tags for display
        const msg = (data.msg || "Something went wrong").replace(/<[^>]*>/g, "");
        reject(new Error(msg));
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Network error — please try again."));
    };

    // Timeout after 10s
    setTimeout(() => {
      if (window[callbackName]) {
        cleanup();
        reject(new Error("Request timed out — please try again."));
      }
    }, 10000);

    document.head.appendChild(script);
  });
}
