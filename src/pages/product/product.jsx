import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

/* 
商品路由
*/
export default class product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/product' component={ProductHome} exact/> {/*路径完全匹配*/}
                    <Route path='/product/addupdate' component={ProductAddUpdate}/>
                    <Route path='/product/detail' component={ProductDetail}/>
                    <Redirect to = '/product'></Redirect>
                </Switch>
            </div>
        )
    }
}
