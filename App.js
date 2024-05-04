import { StyleSheet, View , StatusBar ,Alert ,Image,TouchableHighlight, BackHandler, PermissionsAndroid,} from 'react-native';
import React from 'react';
import Status from './components/Status';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from './components/Toolbar';
import ImageGrid from './components/ImageGrid';


export default class App extends React.Component {

  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/https://i.pinimg.com/originals/1e/bf/93/1ebf934d1e1067be75d69ff26c8070aa.jpg'),
      createTextMessage('this is my project'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
    isInputFocused: false,
  };

  handlePressMessage =  ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
        'Delete message?', //title
        'Are you sure you want to permanently delete this message?', //message to show
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const { messages } = this.state;
              this.setState({ messages: messages.filter(message => message.id !== id) });
            },
          },
        ],
      );
      break;
      
      case 'image':
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;      
      default:
        break;
    }
      
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };    

  renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid  onPressImage={this.handlePressImage} />
    </View>
  );    
  
  componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;

      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }   

  handlePressToolbarCamera = () => {
    // use permission and etc.
  }

  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    navigator.geolocation.getCurrentPosition((position) => {
      const { coords: { latitude, longitude } } = position;
      
      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...messages,
        ],
      });
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };  


  handleSubmit = (text) => {
    const { messages } = this.state;

    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handlePressImage = (uri) => {
    const { messages } = this.state;

    this.setState({
      messages: [createImageMessage(uri), ...messages],
    });
  };
    
    

//-------------------------------------------------------------

renderToolbar() {
  const { isInputFocused } = this.state;

  return (
    <View style={styles.toolbar}>
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={this.handleSubmit}
        onChangeFocus={this.handleChangeFocus}
        onPressCamera={this.handlePressToolbarCamera}
        onPressLocation={this.handlePressToolbarLocation}
      />
    </View>
  );
}

  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
        {this.renderFullscreenImage()}
      </View>
    );
  }

  
}

//-----------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
},
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
    },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
    },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
    },
});
