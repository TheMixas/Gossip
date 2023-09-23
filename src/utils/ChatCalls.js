//fetch user conversations
export function fetchUserConversations() {
  return fetch("http://localhost:8080/chat/get-conversations", {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
  })
}

export function fetchSuggestedFriends() {
  return fetch("http://localhost:8080/users/suggested-friends", {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
  })
}
export function fetchFullConversation(conversationId) {
  return fetch(`http://localhost:8080/chat/get-private-conversation/${conversationId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

