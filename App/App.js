import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import React, { Component } from 'react';


//44c188ad06e81037a011c9486c76fc79
// key stiri e6f42ce2e83945aba580646d8014590a



export default class App extends React.Component {

  render() {
    return (
        <AppContainer />
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
  };
  componentDidMount(){
    fetch('https://newsapi.org/v2/top-headlines?country=ro&apiKey=e6f42ce2e83945aba580646d8014590a')
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          //console.log(myJson);
          let data = JSON.stringify(myJson);
          this.setState({ data });
        });
    }

  render() {
    let stiri = this.state.data;
    return(
      <View style={styles.main}>
        <Text> {stiri} </Text>
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
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });

    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});
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
  
  render() {

    
    let temp = this.state.temp;
    let temp_max = this.state.temp_max;
    let temp_min = this.state.temp_min;
    let mainStatus = this.state.mainStatus;
    let description = this.state.description;
    let clouds = this.state.clouds;
    let wind = this.state.wind;
    let errorMessage = this.state.errorMessage;
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
    
      return(
      <View style={styles.main}>
        <View>
          <Text style = {styles.yourplace}>YOUR PLACE</Text>
        </View>
        <View style = {styles.description}>
          <Text style = {{color:"#C0C0C0",fontSize:25}}>{description}</Text>
        </View>
        <View style = {styles.icon}>
          {WeatherImage}
        </View>
        <View style = {styles.temps}>
            <Text style = {{fontSize:20, color: "#C0C0C0", lineHeight:36}}>{temp_min}°C</Text>
            <Text style = {{fontSize: 30, color: "#C0C0C0", lineHeight:36}}> / </Text>
            <Text style = {{fontSize:25}}>{temp}°C</Text>
            <Text style = {{fontSize: 30, color: "#C0C0C0", lineHeight:36}}> / </Text>
            <Text style = {{fontSize:20, color: "#C0C0C0", lineHeight:36}}>{temp_max}°C</Text>
        </View>
        <View style = {styles.clouds}>
          <Image style = {{width:28, height:28, marginRight: 6}} source = {require("./assets/Weather-images/f/cloud.png")}/>
          <Text>Cloudiness: {clouds}%</Text>
        </View>
        <View style = {styles.windd}>
          <Image style = {{width:25, height:25, marginRight: 8}} source = {require("./assets/Weather-images/f/wind-icon.png")}/>
          <Text >Wind speed: {wind} m/s</Text>
        </View>
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