/* 
包含应用中所有接口请求函数的模块
*/
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
// const BASE = 'http://localhost:5000'

// 登录
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");
// 添加用户
export const reqAddUser = (user) => ajax("/manage/user/add", user, "POST");
// 更新用户
export const reqUpdateUser = (user) =>
  ajax("/manage/user/update", user, "POST");

// 获取用户列表
export const reqList = () => ajax("/manage/user/list");

// 获取一级/二级分类列表
export const reqCategorys = (parentId)=> ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (categoryName, parentId)=> ajax('/manage/category/add',{categoryName, parentId},'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=> ajax('/manage/category/update',{categoryId,categoryName},'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  // 把变量的值作为属性名，需要在外面加括号
  [searchType]: searchName,
})
// 删除指定名称的图片
export const reqDeleteImg = (name)=>ajax('/manage/img/delete',{name},'POST')

// 添加商品或修改商品
export const reqAddOrUpdateProduct = (product)=>ajax('/manage/product/'+(product._id?'update':'add'), product, 'POST')
// 修改商品
// export const reqUpdateProduct = (product)=>ajax('/manage/product/update', product, 'POST')





export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=ee2eb587ae7d4ecd9daa4af0e5c193e1`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
    //   console.log(err, data);
      if (!err && data.status === "1") {
        // 取出需要的数据
        const {city, weather, temperature } = data.lives[0];
        resolve({city, weather, temperature})
      } else {
          message.error('获取天气信息失败')
      }
    });
  });
};
// reqWeather("310000");
