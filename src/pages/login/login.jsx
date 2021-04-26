import React, { Component } from "react";
import "./login.less";
import logo from "../../assets/images/logo.jpg";
import { Icon,Form, Input, Button, message} from "antd";
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from "react-router";


/* 登录路由组件 */
class Login extends Component {

//   自定义密码验证
  validatePwd = (rule, value, callback)=>{
    if (!value){
        callback('密码必须输入')
    } else if(value.length<4){
        callback('密码长度不能小于4位')
    } else if(value.length>12){
        callback('密码长度不能大于12位')
    } else if (!/^[1-9a-zA-Z_]+$/.test(value)){
        callback('密码必须是英文，数字，下划线组成')
    } else {
        callback() //验证通过
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('提交登录请求: ', values);
        // 请求登录
        const {username, password} = values;
        const result = await reqLogin(username, password)
        //  console.log('请求成功',response.data); 
         if(result.status === 0) {
             message.success('登录成功');
            const user = result.data
            memoryUtils.user = user  //保存到内存中
            storageUtils.saveUser(user)  //保存到local中
            //  跳转到管理页面(因为不需要回退，所以用replace)
            this.props.history.replace('/')
         } else {
             message.error('用户名或密码错误',result.msg)
         }
         
      } else {
        console.log('检验失败');
      }
    });
  };

  render() {
    // 如果用户已经登录，自动跳转到首页
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/'/>
    }
    /* 得到具有强大功能的form对象 */
    const form = this.props.form;
    const {getFieldDecorator} = form;
    
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>小董的后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
        {getFieldDecorator('username', {
            // 声明式验证：直接用别人定义好的验证规则来验证
            rules: [
                { required: true, whitespace:true, message: '请输入用户名!' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名至多12位' },
                { pattern: /^[1-9a-zA-Z_]+$/, message: '用户名必须是英文，数字，下划线组成' },
        ],
        initialValue:'admin'//指定初始值
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
        {getFieldDecorator('password', {
            rules: [
                {
                    validator: this.validatePwd
                }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录 
          </Button>
        </Form.Item>
      </Form>
        </section>
      </div>
    );
  }
}

/* 
包装From组件 生成一个新的组件：Form(Login)
为from传递了一个强大的form属性
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

/* 
1.前台表单验证
2.收集表单输入数据
*/