import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import "./index.css";
import logo from "../../assets/images/logo.jpg";
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;
/* 
左侧导航组件
*/
class Leftnav extends Component {
  /* 
    根据menu的数据数组生成对应的标签数组
    map+递归
    */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.map((item) => {
      if (!item.children) {
        return(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        //   查找一个与当前请求路径匹配的子item
        const cItem = item.children.find(cItem=> path.indexOf(cItem.key)===0)
        // 如果存在，说明对应的子列表需要展开
        if (cItem){
            this.openKey = item.key
        }
        return(
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };
  /* 
  在第一次render()之前执行一次
  */
  UNSAFE_componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    //   得到当前请求的路由路径
    let path = this.props.location.pathname
    if (path.indexOf('/product')===0){  //当前请求的是商品或其子路由界面
        path = '/product'
    }
    const openKey = this.openKey
    return (
      <div>
        <div className="left-nav">
          <Link to="/" className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>小董的后台</h1>
          </Link>
        </div>
        <Menu
        selectedKeys = {[path]}
        defaultOpenKeys={[openKey]}
         mode="inline" theme="dark">

          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}
/* 
withRouter高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(Leftnav)