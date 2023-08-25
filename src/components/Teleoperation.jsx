import React, {Component} from "react";
import { Joystick } from 'react-joystick-component';
import ROSLIB from "roslib"

import Config from "../scripts/Config";

class Teleoperation extends Component{
    state = {ros: null}

    constructor() {
        super();
        this.init_connection()
        this.handleMove = this.handleMove.bind(this)
        this.handleStop = this.handleStop.bind(this)
    }

    init_connection() {
        this.state.ros = new ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("connection established in Teleop!");
            console.log(this.state.ros)
            this.setState({ connected: true });
        });

        this.state.ros.on("close", () => {
            console.log("connection is closed!");
            this.setState({ connected: false });

            // try to reconnect every 3 sec
            setTimeout(() => {
                try {
                    this.state.ros.connect(
                        "ws://" +
                        Config.ROSBRIDGE_SERVER_IP +
                        ":" +
                        Config.ROSBRIDGE_SERVER_PORT +
                        ""
                    );
                } catch (error) {
                    console.log("connection problem");
                }
            }, Config.RECONNECTION_TIMER);
        });

        try {
            this.state.ros.connect(
                "ws://" +
                Config.ROSBRIDGE_SERVER_IP +
                ":" +
                Config.ROSBRIDGE_SERVER_PORT +
                ""
            );
        } catch (error) {
            console.log("connection problem");
        }
    }
    handleMove(event){
        console.log("Handle Move")

        //Created ROS publisher on topic cmd_vel
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: "geometry_msgs/Twist"
        })

        //Created a twist message to publish to rosbrigde
        var twist = new window.ROSLIB.Message({
            linear:{
                x: event.y * 1,
                y: 0,
                z: 0
            },
            angular:{
                x: 0,
                y: 0,
                z: -event.x
            }
        })

        //Published the message on the cmd_vel topic
        cmd_vel.publish(twist)
    }
    handleStop(){
        console.log("Handle Stop")

        //Created ROS publisher on topic cmd_vel
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: "geometry_msgs/Twist"
        })

        //Created a twist message to publish to rosbrigde
        var twist = new window.ROSLIB.Message({
            linear:{
                x: 0,
                y: 0,
                z: 0
            },
            angular:{
                x: 0,
                y: 0,
                z: 0
            }
        })

        //Published the message on the cmd_vel topic
        cmd_vel.publish(twist)

    }
    render() {
        return (
        <div>
            <Joystick
                size={100}
                sticky={true}
                baseColor="#EEEEEE"
                stickColor="#BBBBBB"
                move={this.handleMove}
                stop={this.handleStop}>
            </Joystick>
        </div>
        )
    }
}
export default Teleoperation;