import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';
/* 
用于图片上传的组件
*/
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }
    state = {
        previewVisible: false,  //标识是否显示大图预览
        previewImage: '',  //大图的url
        fileList: [
            /* {
                uid: '-1',  //每一个file都有自己唯一的id 建议为负数
                name: 'image.png',
                status: 'done',  //图片的状态：done上传已完成,uploading正在上传,removed已删除
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }, */
        ],
    };

    constructor(props) {
        super(props)
        let fileList = []
        // 如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,  //每一个file都有自己唯一的id 建议为负数
                name: img,
                status: 'done',  //图片的状态：done上传已完成,uploading正在上传,removed已删除
                url: BASE_IMG_URL + img,
            }))
        }
        this.state = {
            previewVisible: false,  //标识是否显示大图预览
            previewImage: '',
            fileList
        }
    }
    /* 
    获取所有已上传图片文件名的数组,需要父组件调用子组件方法
    */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    handleCancel = () => this.setState({ previewVisible: false });
    /* 显示指定file对应的大图 */
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /* file 当前操作的图片 (上传 删除) */
    /* filelist所有图片的数组 */
    handleChange = async ({ file, fileList }) => {
        //   console.log(file, fileList);
        //   一旦上传成功，将当前上传的file的信息修正(name,url)
        if (file.status === 'done') {
            const result = file.response  //{status:0 data:{name:'xxx.jpg',url:'地址'}}
            if (result.status === 0) {
                message.success('上传成功')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        }
        else if (file.status === 'removed') {  //删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }

        }
        //   在操作(上传  删除)过程中更新fileList状态
        this.setState({ fileList })

    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"/* 上传图片的接口地址 */
                    accept='image/*'  /* 只接收图片格式 */
                    name='image'/* 请求参数名 */
                    listType="picture-card"/* 卡片样式 */
                    fileList={fileList}/* 已上传文件的数组 */
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

