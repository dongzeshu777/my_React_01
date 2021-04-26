import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'


/* 
添加分类的组件
*/
const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired, //一级分类的数组
        parentId:PropTypes.string.isRequired,  //父分类的ID
        setForm:PropTypes.func.isRequired   //用来传递form对象的函数
    }
    UNSAFE_componentWillMount(){
        // 将form对象通过setForm()传递给父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const {categorys, parentId} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId //初始值为parentId的值 一级列表显示一级分类 二级列表显示父分类
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules:[
                                {
                                    required:true,
                                    message:'分类名称必须输入'
                                }
                            ]
                        })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)

