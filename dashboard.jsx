import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* SIDEBAR */


function Sidebar({ loggedIn, user, recentChats, onNewChat, onOpenChat }) {
  return (
    <aside className="sidebar">
    
      <div className="logo">
        <div className="logo-symbol">HB</div>
      </div>

      {/* --- Navigation menu --- */}
      <nav className="menu">
        <button className="menu-item new-chat-btn" onClick={onNewChat}>
          <span className="icon">&#9998;</span>
          <span>New Chat</span>
        </button>

        <button className="menu-item" type="button">
          <span className="icon">&#8998;</span>
          <span>Search Chats</span>
        </button>

        <button className="menu-item" type="button">
          <span className="icon">&#9635;</span>
          <span>Library</span>
        </button>

        <button className="menu-item" type="button">
          <span className="icon">&#9638;</span>
          <span>GPTs</span>
        </button>

        <button className="menu-item" type="button">
          <span className="icon">&#8862;</span>
          <span>Projects</span>
        </button>
      </nav>

      {/* Recent chats  */}
      {loggedIn && recentChats.length > 0 && (
        <section className="chat-history">
          <h2>Recent chats</h2>
          {recentChats.map((chat) => (
            <button key={chat._id} onClick={() => onOpenChat(chat)}>
              {chat.topic || "New chat"}
            </button>
          ))}
        </section>
      )}

     
      {loggedIn && user && (
        <div className="profile">
          <div className="profile-picture">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user.name || "Account"}</div>
            <div className="profile-plan">{user.email}</div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* CHAT INPUT BOX */


function ChatInput({ inputRef, input, loading, onInputChange, onSend }) {
  return (
    <form className="chat-input" onSubmit={onSend}>
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask anything"
        aria-label="Write a message"
        rows={1}
      />
      <button
        type="submit"
        className="send-btn"
        disabled={loading || !input.trim()}
        aria-label="Send message"
      >
        &uarr;
      </button>
    </form>
  );
}

/* DASHBOARD PAGE*/


export function DashboardPage(props) {
  const {
    user, loggedIn, messages, recentChats, models, model,
    input, loading, error, inputRef,
    onModelChange, onInputChange, onNewChat, onOpenChat,
    onLogout, onLogin, onRegister, onSend,
  } = props;

  return (
    <div className="app-shell">
      {/* Left sidebar */}
      <Sidebar
        loggedIn={loggedIn}
        user={user}
        recentChats={recentChats}
        onNewChat={onNewChat}
        onOpenChat={onOpenChat}
      />

      {/* Right main area */}
      <main className="main-content">
      
        <header className="topbar">
          <div className="version-selector">
            <label>
              Model
              <select
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                aria-label="Choose model"
              >
                {models.length
                  ? models.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))
                  : <option value={model}>{model}</option>}
              </select>
            </label>
          </div>

          <div className="auth-buttons">
            {loggedIn ? (
              <button className="btn-logout" onClick={onLogout}>Logout</button>
            ) : (
              <>
                <button className="btn-login" onClick={onLogin}>Login</button>
                <button className="btn-register" onClick={onRegister}>Register</button>
              </>
            )}
          </div>
        </header>

        {/* Chat area */}
        {messages.length === 0 ? (
       
          <section className="chat-container welcome">
            <h1>How can I help you?</h1>
            <ChatInput
              inputRef={inputRef}
              input={input}
              loading={loading}
              onInputChange={onInputChange}
              onSend={onSend}
            />
            {error && <p className="error-text" role="alert">{error}</p>}
          </section>
        ) : (
   
          <section className="chat-container conversation">
            <div className="messages-list">
              {messages.map((msg, index) => (
                <article
                  className={`message ${msg.role}`}
                  key={msg.id || `${index}-${msg.role}`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </article>
              ))}
              {loading && <p className="thinking-text">Thinking…</p>}
              {error && <p className="error-text" role="alert">{error}</p>}
            </div>
            <ChatInput
              inputRef={inputRef}
              input={input}
              loading={loading}
              onInputChange={onInputChange}
              onSend={onSend}
            />
          </section>
        )}
      </main>
    </div>
  );
}
