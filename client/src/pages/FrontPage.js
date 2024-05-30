import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { removeToken, axiosInstance } from '../utils/authUtil.js';
import io from 'socket.io-client';
import { promisify } from 'util';

// Connect to the Socket.IO server
const socket = io('http://localhost:3001');

const theme = createTheme();

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const ToolbarStyled = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const SearchBar = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadius,
}));

const ChatContainer = styled('div')({
  display: 'flex',
  flexGrow: 1,
});

const ChatList = styled('div')({
  width: '35%',
  overflowY: 'auto',
  height: 'calc(100vh - 64px)', // Adjust the height as per your AppBar height
});

const ChatWindow = styled('div')(({ theme }) => ({
  width: '65%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 64px)', // Adjust the height as per your AppBar height
}));

const ChatMessages = styled('div')({
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end', // Align messages to the bottom right
});

const SentMessage = styled('div')({
  alignSelf: 'flex-start', // Align sent messages to the start
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  padding: '8px',
  marginBottom: '8px',
});

const ReceivedMessage = styled('div')({
  alignSelf: 'flex-end', // Align received messages to the end
  backgroundColor: '#dcf8c6',
  borderRadius: '8px',
  padding: '8px',
  marginBottom: '8px',
});

const ChatInput = styled('form')({
  marginTop: theme.spacing(2),
});

const InfoBar = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const FrontPage = ({ onLogout }) => {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [additionalMessages, setAdditionalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [infoBarContent, setInfoBarContent] = useState('');
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userResponse = await axiosInstance.get('/getUser');
        setUsername(userResponse.data.username);
        setUserId(userResponse.data.userId);
        const chatResponse = await axiosInstance.get('/getChats');
        setChats(chatResponse.data.chats);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (currentChat) {
        try {
          const response = await axiosInstance.get(
            `/getChatMessages?chatId=${currentChat}`
          );
          setChatMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      }
    };

    fetchChatMessages();
  }, [currentChat]);

  useEffect(() => {
    // Listen for incoming messages from the socket
    socket.on('receive-message', async (data) => {
      const { messageObj, receiverIds, chatId } = data;
      if (receiverIds.includes(userId)) {
        // Update the new message state with the received message
        if (chatId === currentChat) setNewMessage(messageObj);
        console.log(status, messageObj.sender, userId);
        if (
          status === 'BUSY' &&
          messageObj.sender.toString() !== userId.toString()
        ) {
          console.log('yes here');
          const response = await axiosInstance.post(`/getAiResponse`, {
            prompt: messageObj.content,
          });

          socket.emit('send-message', {
            message: response.data.message,
            senderId: userId,
            chatId,
          });
        }
      }
    });

    return () => {
      // Clean up the socket listener
      socket.off('receive-message');
    };
  }, [currentChat, userId, status]);

  useEffect(() => {
    if (newMessage) {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    console.log(chatMessages);
  }, [newMessage]);

  const handleStatusAction = () => {
    setStatus((prevStatus) =>
      prevStatus === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE'
    );
  };

  const fetchUserStatus = async () => {
    try {
      const userResponse = await axiosInstance.get('/getUser');
      setStatus(userResponse.data.status);
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userResponse = await axiosInstance.get('/getUser');
        setUsername(userResponse.data.username);
        setUserId(userResponse.data.userId);
        const chatResponse = await axiosInstance.get('/getChats');
        setChats(chatResponse.data.chats);
        // Call the fetchUserStatus function to get the initial status
        fetchUserStatus();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchDetails();
  }, []);

  const handleSearchAction = async (searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/handleSearch?search=${searchTerm}`
      );
      console.log('Search response: ', response.data.chat);

      if (Object.keys(response.data.chat).length === 0) {
        return;
      }

      setChats((prevChats) => [response.data.chat, ...prevChats]);
      console.log('Chats: ', chats);
      window.location.reload();
    } catch (error) {
      console.error('Error handling search:', error);
    }
  };

  const handleChatSelection = (chatId) => {
    let selectedChat = chats.find((chat) => chat._id === chatId);
    setCurrentChat(selectedChat._id);
    setInfoBarContent(selectedChat?.name || 'X');
    setCount(1);
    console.log(currentChat);
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (currentChat) {
        try {
          const response = await axiosInstance.get(
            `/getChatMessages?chatId=${currentChat}`
          );
          setChatMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      }
    };

    fetchChatMessages();
  }, [currentChat, chats]);

  const handleLoadMoreMessages = async () => {
    if (currentChat) {
      setCount((prevCount) => prevCount + 1);
      setLoadingMore(true);
      try {
        const response = await axiosInstance.post(`/getMoreMessages`, {
          chatId: currentChat,
          skip: 10 * count,
        });
        // Update the additionalMessages state with the new messages
        setAdditionalMessages(response.data.messages);
      } catch (error) {
        console.error('Error loading more messages:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (additionalMessages.length > 0) {
      setChatMessages((prevMessages) => [
        ...additionalMessages,
        ...prevMessages,
      ]);
      console.log(chatMessages);
      setAdditionalMessages([]); // Reset additionalMessages after updating chatMessages
    }
  }, [additionalMessages]);

  const handleChangeMessage = (e) => {
    setMessageContent(e.target.value);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim()) {
      return;
    }

    try {
      socket.emit('send-message', {
        message: messageContent,
        senderId: userId,
        chatId: currentChat,
      });
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      console.log('Logout API call');
      removeToken(); // Remove the token from localStorage
      onLogout(); // Call the onLogout function passed from App.js
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <AppBarStyled position='static'>
          <ToolbarStyled>
            <Typography variant='h6'>Welcome, {username}</Typography>
            <Button
              variant='contained'
              color='secondary'
              onClick={handleStatusAction}
            >
              {status}
            </Button>
            <div style={{ flexGrow: 1 }} />
            <SearchBar>
              <InputBase
                placeholder='Search...'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchAction(e.target.value);
                  }
                }}
              />
            </SearchBar>
            <Button
              color='secondary'
              variant='contained'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ToolbarStyled>
        </AppBarStyled>
        <ChatContainer>
          <ChatList>
            <List>
              {chats.map((chat) => (
                <ListItem
                  button
                  key={chat._id}
                  onClick={() => handleChatSelection(chat._id)}
                >
                  <ListItemText primary={chat.name} />
                </ListItem>
              ))}
            </List>
          </ChatList>
          <Divider orientation='vertical' flexItem />
          {infoBarContent !== '' && (
            <ChatWindow>
              <InfoBar>{infoBarContent}</InfoBar>
              {loadingMore && <Typography>Loading more messages...</Typography>}
              {!loadingMore && (
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleLoadMoreMessages}
                >
                  Load More Messages
                </Button>
              )}
              <ChatMessages>
                {chatMessages.map((message, index) => (
                  <div key={index}>
                    {message.sender.toString() === userId.toString() ? (
                      <ReceivedMessage>{message.content}</ReceivedMessage>
                    ) : (
                      <SentMessage>{message.content}</SentMessage>
                    )}
                  </div>
                ))}
              </ChatMessages>
              <ChatInput onSubmit={handleSubmitMessage}>
                <TextField
                  name='message'
                  label='Type your message'
                  variant='outlined'
                  fullWidth
                  multiline
                  rows={3}
                  value={messageContent}
                  onChange={handleChangeMessage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSubmitMessage(e);
                    }
                  }}
                />
              </ChatInput>
            </ChatWindow>
          )}
        </ChatContainer>
      </Root>
    </ThemeProvider>
  );
};

export default FrontPage;
