//fetch user conversations
import {apiURL} from "../api";

export function fetchUserConversations() {
  return fetch(`${apiURL}/chat/get-conversations`, {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
  })
}

export function fetchSuggestedFriends() {
  return fetch(`${apiURL}/users/suggested-friends`, {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
  })
}
export function fetchFullConversation(conversationId) {
  return fetch(`${apiURL}/chat/get-private-conversation/${conversationId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

