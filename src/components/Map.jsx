import React, { Component } from 'react';
import Config from '../scripts/Config';


class Map extends Component{
    state = {
        ros: null,
    };

    constructor(){
        super();
        this.view_map = this.view_map.bind(this);
    }

    init_connection(){
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection",() => {          //Triger when there is an event and event here will be connected
            console.log("connection established in RobotState Component!");
            console.log(this.state.ros);
            this.setState({connected : true});           //Update the state if connected
        });

        this.state.ros.on("close", () => {          //Create another event when the connection is closed
            console.log("connection is closed");
            this.setState({connected : false});
            setTimeout(() => {
                try {
                    this.state.ros.connect( "ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT);                     //This event will take a string that represent the connections, setting the IP address and the PORT number
                }catch(error){
                    console.log("connection problem");
                }
            },Config.RECONNECTION_TIMER);
        });
        //To take the connection parameters
        //We need to get them from the machine where the ROSbridge is running
        //To get the IP write command ifconfig
        //And the PORT Number by default is 9090
        try {
            this.state.ros.connect( "ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT );                     //This event will take a string that represent the connections, setting the IP address and the PORT number
        }catch(error){
            console.log("connection problem");
        }
    }

    componentDidMount(){
        this.init_connection();
        this.view_map();
    }


    view_map(){
        var viewer = new window.ROS2D.Viewer({
            divID: "nav_div",
            width:640,
            height:480
        });

        var navClient = new window.NAV2D.OccupancyGridClientNav({
            ros: this.state.ros,
            rootObject: viewer.scene,
            viewer: viewer,
            serverName: "/move_base",
            withOrientation: true,
        });
    }



    render(){
        return <div>
            <div id = "nav_div">Viewer</div>
        </div>;
    }

}


export default Map;