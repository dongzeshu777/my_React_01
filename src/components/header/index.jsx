import React, { Component } from "react";
import { Modal } from "antd";
import LinkButton from '../link-button'
import { reqWeather } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dataUtils";
import menuList from "../../config/menuConfig";
import "./index.less";
import { withRouter } from "react-router";
import storageUtils from "../../utils/storageUtils";

/* 
头部组件
*/

class Header extends Component {
  state = {
    reporttime: formateDate(Date.now()),
    weather: "",
    temperature: "",
  };
  getTime = () => {
    this.intervalId = setInterval(() => {
      const reporttime = formateDate(Date.now());
      this.setState({ reporttime });
    }, 1000);
  };
  getWeather = async() => {
      const { city, weather, temperature } = await reqWeather("310000");
      this.setState({ city, weather, temperature });
  };
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        // 在所有的子item中查找匹配的
        const cItem = item.children.find((cItem) => path.indexOf(cItem.key)===0);
        if (cItem) {
          // 取出它的title
          title = cItem.title;
        }
      }
    });
    return title;
  };
  logout = () => {
    Modal.confirm({
      content: "确定退出吗？",
      onOk: () => {
        storageUtils.removeUser(); //保存到local中
        memoryUtils.user = {};
        //  跳转到管理页面(因为不需要回退，所以用replace)
        this.props.history.replace("/login");
      },
    });
  };

  componentDidMount() {
    // 一般在此执行异步操作：发ajax请求/启动定时器
    this.getWeather();
    this.getTime();
  }
  componentWillUnmount(){
    //   当前组件卸载之前调用
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    const { reporttime, city,weather, temperature } = this.state;
    const username = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{reporttime}</span>
            {/* <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/> */}
            <span>{city}</span>
            <span>{weather}</span>
            <span>{temperature}°C</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
