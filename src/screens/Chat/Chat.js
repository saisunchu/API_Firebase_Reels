import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export function Chat({route}) {
  const [messages, setMessages] = useState([])

  const {documentID, emailSender, emailReceiver } = route.params;
  console.log('documentId=========', documentID);

  console.log('messages=========', messages);

  useEffect(() => {
    
    FireStoreChatGet();
  }, [])

  const RealTimeChat = useCallback(() => {
        
    FireStoreChatGet();
    
  }, []);

  useFocusEffect(RealTimeChat);

  

  // const FireStoreChatGet = () =>
  // {
  //   // const obj = messages.reduce((acc, obj) => {
  //   //   acc[obj._id] = obj;
  //   //   return acc;
  //   // }, {});

  //   // console.log('obj============',obj);

  //   //  const messageRef = firestore()
  //   //     .collection('Chats')
  //   //     .doc(documentID)
  //   //     .get()
  //   //     .then((response) => {
  //   //       const data = response.data();
  //   //       if(data != null)
  //   //       {
  //   //         const messagesArray = Object.keys(data).map((key) => data[key]);
  //   //         messagesArray.map((arr)=> arr.createdAt = arr.createdAt.toDate() )          
  //   //         console.log('messagesArray=========',messagesArray);
  //   //         setMessages(messagesArray);
  //   //       }
  //   //     });

        
  
  // }


  const FireStoreChatGet = () => {
    return firestore()
      .collection('Chats')
      .doc(documentID)
      .onSnapshot((doc) => {
        const data = doc.data();
        if (data != null) {
          const messagesArray = Object.keys(data).map((key) => data[key]);
          messagesArray.map((arr) => (arr.createdAt = arr.createdAt.toDate()));
          console.log('messagesArray=========', messagesArray);
          setMessages(messagesArray);
        }
      });
  }






  const FireStoreChat = () =>
  {
    // const obj = messages.reduce((acc, obj) => {
    //   acc[obj._id] = obj;
    //   return acc;
    // }, {});

    // console.log('obj============',obj);

    const newArr = global.lastmessage.concat(messages);

      firestore()
        .collection('Chats')
        .doc(documentID)
        .set({ ...newArr })
        .then(() => {

          console.log('Messages added!=====', messages);
        });
  
  }


  const onSend = (messageArray) => {
    console.log('messageArray in onSend =========', messageArray);
    global.lastmessage = messageArray;
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messageArray),
    )
    // setMessages(previousMessages => previousMessages.concat(messageArray) )
    FireStoreChat();
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: emailSender,
      }}
      
    />
  )
}