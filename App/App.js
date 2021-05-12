import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import React, { Component } from 'react';
import * as Font from 'expo-font';

//44c188ad06e81037a011c9486c76fc79
// key stiri e6f42ce2e83945aba580646d8014590a



export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    await Font.loadAsync({
      'open-sans-bold': require('./assets/Fonts/OpenSans-Bold.ttf'),
      'open-sans-bold-italic': require('./assets/Fonts/OpenSans-BoldItalic.ttf'),
      'open-sans-extra-bold': require('./assets/Fonts/OpenSans-ExtraBold.ttf'),
      'open-sans-extra-bold-italic': require('./assets/Fonts/OpenSans-ExtraBoldItalic.ttf'),
      'open-sans-italic': require('./assets/Fonts/OpenSans-Italic.ttf'),
      'open-sans-light': require('./assets/Fonts/OpenSans-Light.ttf'),
      'open-sans-light-italic': require('./assets/Fonts/OpenSans-LightItalic.ttf'),
      'open-sans-regular': require('./assets/Fonts/OpenSans-Regular.ttf'),
      'open-sans-semibold': require('./assets/Fonts/OpenSans-SemiBold.ttf'),
      'open-sans-semibold-italic': require('./assets/Fonts/OpenSans-SemiBoldItalic.ttf'),
    });

    this.setState({ fontLoaded: true });
  }


  render() {
    return (
      this.state.fontLoaded ? (
        <AppContainer />
      ) : null
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return(
      <View style={styles.main}>

      </View>
    );
  }
}

class MoneyScreen extends React.Component {
  render() {
    return(
      <View style={styles.main}>

      </View>
    );
  }
}

class NewsScreen extends React.Component {
  state = {
    data:null,
    URLImage: null,
    image: null,
    title:null,
    siteURL:null,
  };
  componentDidMount(){
    fetch('https://newsapi.org/v2/top-headlines?country=ro&apiKey=e6f42ce2e83945aba580646d8014590a')
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          //console.log(myJson.articles[0]);
          let ImageURL = JSON.stringify(myJson.articles[0].urlToImage);
          let title = JSON.stringify(myJson.articles[0].title);
          let siteURL  =JSON.stringify(myJson.articles[0].url);
          console.log(ImageURL);
          this.setState({ URLImage: ImageURL });
        });
    }

  render() {
    
    return(
      <View style={{alignItems:"center",justifyContent:"center",marginTop:100}}>
        <Text>{this.state.URLImage}</Text>
        {this.state.URLImage ?
        <Image source={{uri: this.state.URLImage}} style={{width: 130, height:110}}/>
        : 
        null
      }
      </View>

    );
  }
}

class WeatherScreen extends React.Component {
  
  state = {
    errorMessage: null,
    temp:null,
    temp_max:null,
    temp_min:null,
    mainStatus:null,
    description:null,
    weatherStatus: null,
    clouds:null,
    wind:null,
    snow:null,
    rain:null,
    id:null,
  };

  

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let location;
    let { status }  = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied, please activate location and reopen the app.',
      });

    } else {
      try
      {
        location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
      } catch(e){
        alert('We could not find your position. Please make sure your location service provider is on');
        console.log('Error while trying to get location: ', e);
        this.setState({
          errorMessage: 'Permission to access location was denied, please activate location and reopen the app.',
        });
      }
    
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;
    
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=44c188ad06e81037a011c9486c76fc79')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        //console.log(myJson);
        function roundToTwo(num) {    
          return +(Math.round(num + "e+2")  + "e-2");
      }
        //console.log(myJson.main.temp);
        let temp = roundToTwo(myJson.main.temp - 273.15);
        let temp_max = roundToTwo(myJson.main.temp_max - 273.15);
        let temp_min = roundToTwo(myJson.main.temp_min - 273.15);
        let mainStatus = myJson.weather[0].main;
        let description = myJson.weather[0].description;
        let clouds = myJson.clouds.all;
        let wind = myJson.wind.speed;
        let id = myJson.weather[0].id;
        
        this.setState({temp, temp_max,id, temp_min, mainStatus, description,clouds,wind})
        
      })

      .catch((error) => {
        console.error(error);
      });
    };
  }
  render() {


    
    let temp = this.state.temp;
    let temp_max = this.state.temp_max;
    let temp_min = this.state.temp_min;
    let mainStatus = this.state.mainStatus;
    let description = this.state.description;
    let clouds = this.state.clouds;
    let wind = this.state.wind;
    let id = this.state.id;
    let WeatherImage;
    //get day/night
    const hours = new Date().getHours();
    const isDayTime = hours > 5 && hours < 20;
    //thunderstorm
    if (id == 200 || id == 201 || id == 202 || id == 210 || id == 211 || id == 212 ||  id == 221 || id == 230 || id == 231 || id == 232)
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/thunderstorm.png")} />}
    
    //drizzle
    if(id == 300 || id == 301 || id == 302 || id == 310 || id == 311 || id == 312 || id == 313 || id ==314 || id == 321)
      if(isDayTime)
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/day-shower.png")} />}
      else
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/night-shower.png")} />}
    //rain
    if(id == 500 || id == 501 || id == 502 || id == 503 || id == 504 || id == 511)
      if(isDayTime)
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/day-rain.png")} />}
      else
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/night-rain.png")} />}
    if(id == 520 || id == 521 || id == 522 || id == 531)
      if(isDayTime)
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/day-shower.png")} />}
      else
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/night-shower.png")} />}
    //snow
    if(id == 600 || id == 601 || id == 602 || id == 611 || id == 612 || id == 613 || id == 615 || id == 616 || id == 620 || id == 621 || id == 622)
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/snow.png")} />}
    //atmosphere
    if(id == 701 || id == 711 || id == 721 || id == 731 || id == 741 || id == 751 || id == 761 || id == 762 || id == 771 || id == 781)
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/wind.png")} />}
    if(id == 800)
      if(isDayTime)
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/clear-sky-sun.png")} />}
      else
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/clear-sky-night.png")} />}
    //clouds
    if(id == 801)
      if(isDayTime)
        {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/clouds-day.png")} />}
      else
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/clouds-night.png")} />}
    if(id == 802)
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/cloud.png")} />}
    if(id == 803 || id == 804)
      {WeatherImage = <Image style = {{width: 300, height:300}} source ={require("./assets/Weather-images/f/cloudy.png")} />}



      let displayOutput;
      let errorMessage = this.state.errorMessage;
      if(errorMessage!=null)
        displayOutput = <View style={{marginTop:300}}><Text>{errorMessage}</Text></View>
      else
        {
          displayOutput = 
        <View style={styles.main}>
          <View>
          <Text style = {styles.yourplace}>Weather</Text>
        </View>
        <View style = {styles.description}>
          <Text style = {{color:"#C0C0C0",fontSize:25,fontFamily:"open-sans-semibold"}}>{description}</Text>
        </View>
        <View style = {styles.icon}>
          {WeatherImage}
        </View>
        <View style = {styles.temps}>
            <Text style = {{fontSize:20, color: "#C0C0C0", lineHeight:36,fontFamily:"open-sans-semibold"}}>{temp_min}°C</Text>
            <Text style = {{fontSize: 30, color: "#C0C0C0", lineHeight:36,fontFamily:"open-sans-semibold"}}> / </Text>
            <Text style = {{fontSize:25,fontFamily:"open-sans-semibold"}}>{temp}°C</Text>
            <Text style = {{fontSize: 30, color: "#C0C0C0", lineHeight:36,fontFamily:"open-sans-semibold"}}> / </Text>
            <Text style = {{fontSize:20, color: "#C0C0C0", lineHeight:36,fontFamily:"open-sans-semibold"}}>{temp_max}°C</Text>
        </View>
        <View style = {styles.clouds}>
          <Image style = {{width:28, height:28, marginRight: 6}} source = {require("./assets/Weather-images/f/cloud.png")}/>
          <Text style = {{fontFamily:"open-sans-semibold"}}>Cloudiness: {clouds}%</Text>
        </View>
        <View style = {styles.windd}>
          <Image style = {{width:25, height:25, marginRight: 8}} source = {require("./assets/Weather-images/f/wind-icon.png")}/>
          <Text style = {{fontFamily:"open-sans-semibold"}} >Wind speed: {wind} m/s</Text>
        </View>
      </View>
        }
    
      return(
        <View style={{alignItems:"center"}}>
          {displayOutput}
        </View>
    );
  }
}

class AgendaScreen extends React.Component {
  render() {
    return(
      <View>
        
      </View>
    );
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Money: {
      screen: MoneyScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'money-bill-wave'} size = {22.5} color = {tintColor} />
        )
      }
    },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'newspaper'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'home'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Notes: {
      screen: AgendaScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'list-alt'} size = {22.5} color = {tintColor} />
        )
      }
    },
    Weather: {
      screen: WeatherScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={'cloud-sun'} size = {22.5} color = {tintColor} />
        )
      }
    },
  },
  {
    lazy: false,
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#f1fcfc',
      activeBackgroundColor: '#a4d7e1',
      inactiveBackgroundColor: '#daf1f9',
      inactiveTintColor: '#142850',
      adaptive: true
    }
  }
);

const styles = StyleSheet.create({
  main:{
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'#fff',
    margin:30,
  },

  temps:
  {
    flexDirection:'row',
    marginBottom:20
  },
  
  yourplace:
  {
    marginTop:35,
    fontSize:35,
    fontFamily:"open-sans-semibold"
    
    

  },

  windd:
  {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  clouds:
  {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  description:
  {
  
  },

  icon:
  {
    
  }
});

const AppContainer = createAppContainer(bottomTabNavigator);