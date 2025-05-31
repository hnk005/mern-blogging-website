import { removeFromSession } from "@/services/session";

export const onUnauthorized = () => {
  removeFromSession("access_token");
  removeFromSession("user");

  const event = new CustomEvent("force-logout");
  window.dispatchEvent(event);
};
