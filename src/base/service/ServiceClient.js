import WebStorageUtil from "../util/WebStorageUtil";

const CP_API_URL = "http://118.178.137.101:8000/api";
// const CP_API_URL = "/api";

export default class ServiceClient
{
    static _instance = null;

    constructor()
    {
        this._user = null;
    }

    get user()
    {
        return this._user;
    }

    static getInstance()
    {
        if(ServiceClient._instance === null)
        {
            ServiceClient._instance = new ServiceClient();
        }
        return ServiceClient._instance;
    }

    autoLogin()
    {
        const token = WebStorageUtil.getToken();
        const isSave = WebStorageUtil.getIsSaveStorage();
        const userStorage = WebStorageUtil.getUserStorage();
        const self = this;
        return new Promise((resolve, reject) => {
            if (token)
            {
                self.getUserInfo(token).then(res => {
                    if (res.textStatus === "success")
                    {
                        let info = Object.assign(res, { status:0 });
                        info.token = token;
                        resolve(info);
                    }
                    else
                    {
                        if (userStorage && isSave === "saved")
                        {
                            self.login(userStorage).then(result => {
                                if (result.textStatus === "success")
                                {
                                    const info = Object.assign(result, { status:0 });
                                    resolve(info);
                                }
                                else
                                {
                                    const info = Object.assign(result, { status:-1 });
                                    resolve(info);
                                }
                            });
                        }
                        else
                        {
                            resolve( {status: -1} );
                        }
                    }
                });
            }
            else
            {
                if (userStorage && isSave === "saved")
                {
                    self.login(userStorage).then(result => {
                        if (result.textStatus === "success")
                        {
                            const info = Object.assign(result, { status:0 });
                            resolve(info);
                        }
                        else
                        {
                            const info = Object.assign(result, { status:-1 });
                            resolve(info);
                        }
                    });
                }
                else
                {
                    resolve( {status: -1} );
                }
            }
        });
    }

    getUserInfo(token)
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/user/getUserInfo`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                timeout: 5000
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if(textStatus=='timeout')
                {
                    console.log("timeout", jqXHR, errorThrown);
                }
                else
                {
                    console.log(jqXHR.responseJSON);
                }
                const res = {
                    status: jqXHR.status,
                    textStatus,
                }
                resolve(res);
            });
        });
    }

    checkUserIsValid(phone)
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/user/checkUserIsValid?phone=${phone}`,
                type: "GET",
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }

    sendAuthCode(phone)
    {
        const sendData = JSON.stringify({ "phone": phone });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/user/sendAuthCode`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }

    register(user)
    {
        const sendData = JSON.stringify({
            "phone": user.phone,
            "password": user.password,
            "verifyCode": user.code,
            "qq": user.qq
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/user/register`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                WebStorageUtil.setToken(res.token);
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }

    resetPassword(user)
    {
        const sendData = JSON.stringify({
            "phone": user.phone,
            "password": user.password,
            "verifyCode": user.code
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/user/resetPassword`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                WebStorageUtil.setToken(res.token);
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }

    login(user)
    {
        const sendData = JSON.stringify({
            "phone": user.phone,
            "password": user.password
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/user/login`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                WebStorageUtil.setToken(res.token);
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }


    getCourseSpeciality()
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/course/speciality`,
                type: "GET",
                timeout: 5000,
                cache: true
            }).then((data, textStatus, jqXHR) => {
                resolve(data);
            }, (jqXHR, textStatus, errorThrown) => {
                if(textStatus=='timeout')
                {
                    console.log("timeout", jqXHR, errorThrown);
                }
                else
                {
                    console.log(jqXHR.responseJSON);
                }
            });
        });
    }

    getAllCourseList()
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/course/courseList`,
                type: "GET",
                data: {
                    page: 1,
                    limit: 50
                },
                cache: true,
                timeout: 5000
            }).then((data, textStatus, jqXHR) => {
                resolve(JSON.parse(data));
            }, (jqXHR, textStatus, errorThrown) => {
                if(textStatus=='timeout')
                {
                    console.log("timeout", jqXHR, errorThrown);
                }
                else{
                    console.log(jqXHR.responseJSON);
                }
            });
        });
    }


    getCourseList(specialityId)
    {
        const id = specialityId.toString();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/course/courseList`,
                type: "GET",
                data: {
                    page: 1,
                    limit: 100,
                    specialityId: id
                },
                cache: true,
                timeout: 5000
            }).then((data, textStatus, jqXHR) => {
                resolve(JSON.parse(data));
            }, (jqXHR, textStatus, errorThrown) => {
                if(textStatus=='timeout')
                {
                    console.log("timeout", jqXHR, errorThrown);
                }
                else{
                    console.log(jqXHR.responseJSON);
                }
            });
        });
    }

    search(courseKey)
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/course/courseList`,
                type: "GET",
                data: {
                    page: 1,
                    limit: 100,
                    key: courseKey
                }
            }).then((data, textStatus, jqXHR) => {
                resolve(JSON.parse(data));
            }, (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseJSON);
            });
        });
    }

    getCourseDetail(courseId)
    {
        const id = courseId.toString();
        const token = WebStorageUtil.getToken();
        let paras = null;
        if (token)
        {
            paras = {
                url: `${CP_API_URL}/web/course/courseDetail`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {
                    id
                }
            }
        }
        else
        {
            paras = {
                url: `${CP_API_URL}/web/course/courseDetail`,
                type: "GET",
                data: {
                    id
                }
            }
        }
        return new Promise((resolve, reject) => {
            $.ajax(paras).then((data, textStatus, jqXHR) => {
                resolve(data);
            }, (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseJSON);
            });
        });
    }

    getTopicDetail(topicId)
    {
        const id = topicId.toString();
        const token = WebStorageUtil.getToken();
        let paras = null;
        if (token)
        {
            paras = {
                url: `${CP_API_URL}/web/course/topicDetail`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {
                    id
                }
            }
        }
        else
        {
            paras = {
                url: `${CP_API_URL}/web/course/topicDetail`,
                type: "GET",
                data: {
                    id
                }
            }
        }
        return new Promise((resolve, reject) => {
            $.ajax(paras).then((data, textStatus, jqXHR) => {
                resolve(data);
            }, (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseJSON);
            });
        });
    }

    getCommentList(topicId)
    {
        const id = topicId.toString();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/comment/getCommentList`,
                type: "GET",
                data: {
                    topicId: id,
                    page: 1,
                    limit: 100
                }
            }).then((data, textStatus, jqXHR) => {
                resolve(JSON.parse(data));
            }, (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseJSON);
            });
        });
    }

    getReplyList(paras)
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/comment/getCommentList`,
                type: "GET",
                data: {
                    topicId: paras.topicId,
                    commentId: paras.commentId,
                    page: 1,
                    limit: 100
                }
            }).then((data, textStatus, jqXHR) => {
                resolve(JSON.parse(data));
            }, (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseJSON);
            });
        });
    }

    postComment(comment, token)
    {
        const self = this;
        const sendData = JSON.stringify({
            "topicId": comment.topicId,
            "content": comment.content
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/comment/postComment`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/comment/postComment`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            }, (jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", message: "请重新登录"});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    replyComment(reply, token)
    {
        const self = this;
        const sendData = JSON.stringify({
            "topicId": reply.topicId,
            "replyId": reply.replyId,
            "content": reply.content
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/comment/postComment`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/comment/postComment`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            }, (jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", message: "请重新登录"});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    updateUserInfo(userInfo, token)
    {
        const self = this;
        const sendData = JSON.stringify({
            "nickname": userInfo.nickname,
            "avatar": userInfo.avatar,
            "gender": userInfo.gender
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/user/updateUserInfo`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}//user/user/updateUserInfo`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            }, (jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", message: "请重新登录"});
                        }
                    });
                }
                else
                {
                    resolve(Object.assign(jqXHR.responseJSON, {textStatus}));
                }
            });
        });
    }

    changePassword(passwords, token)
    {
        const self = this;
        const sendData = JSON.stringify({
            "oldPassword": passwords.oldPassword,
            "newPassword": passwords.newPassword
        });
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/user/changePassword`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/user/changePassword`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", message: "请重新登录"});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }



    loginFortoken()
    {
        const userStorage = WebStorageUtil.getUserStorage();
        const self = this;
        return new Promise((resolve, reject) => {
            if (userStorage)
            {
                self.login(userStorage).then(result => {
                    if (result.textStatus === "success")
                    {
                        WebStorageUtil.setToken(result.token);
                        resolve({token: result.token, status: 0});
                    }
                    else
                    {
                        const info = Object.assign(result, { status:-1 });
                        resolve(info);
                    }
                });
            }
            else
            {
                resolve({status: -1});
            }
        });
    }

    getCharge(data)
    {
        const token = WebStorageUtil.getToken();
        const sendData = JSON.stringify(data);
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `${CP_API_URL}/user/pay`,
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/pay`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", message: "请重新登录"});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    checkOrderStatus(orderId)
    {
        const token = WebStorageUtil.getToken();
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/pay/checkOrderStatus`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {
                    id: orderId
                },
                timeout: 20000
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/pay/checkOrderStatus`,
                                type: "GET",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: {
                                    id: orderId
                                },
                                timeout: 20000
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign({status:jqXHR.status}, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({status: 403, textStatus: "error"});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    getDownloadUrl(resourceId)
    {
        const token = WebStorageUtil.getToken();
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/resource/getDownloadUrl`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {
                    id: resourceId
                }
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/resource/getDownloadUrl`,
                                type: "GET",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: {
                                    id: resourceId
                                }
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", code: -1});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    getQuestionChance(authorId)
    {
        const token = WebStorageUtil.getToken();
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/author/getQuestionChance`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {
                    authorId: authorId
                }
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/author/getQuestionChance`,
                                type: "GET",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: {
                                    authorId: authorId
                                }
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", code: -1});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }


    publishQuestion(question)
    {
        const token = WebStorageUtil.getToken();
        const sendData = JSON.stringify(question);
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/author/publishQuestion`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/author/publishQuestion`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", code: -1});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

    publishFeedBack(feedback)
    {
        const token = WebStorageUtil.getToken();
        const sendData = JSON.stringify(feedback);
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/feedback/publishFeedBack`,
                type: "POST",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: sendData
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/feedback/publishFeedBack`,
                                type: "POST",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: sendData
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", code: -1});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }


    getFileToken(key)
    {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/web/file/getFileToken`,
                type: "GET",
                data: {
                    key: key
                }
            }).then((data, textStatus, jqXHR) => {
                resolve(data);
            }, (jqXHR, textStatus, errorThrown) => {
                let res = null;
                if (jqXHR.status === 500)
                {
                    res={textStatus, message: "服务器500错误"}
                }
                else
                {
                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                }
                resolve(res);
            });
        });
    }


    deleteComment(commentId)
    {
        const token = WebStorageUtil.getToken();
        const self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${CP_API_URL}/user/comment/deleteComment`,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                headers: {
                    "Authorization": "Basic " + btoa(token + ":")
                },
                data: {commentId}
            }).then((data, textStatus, jqXHR) => {
                const res = Object.assign(data, {textStatus});
                resolve(res);
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 403)
                {
                    self.loginFortoken().then(res => {
                        if (res.status === 0)
                        {
                            $.ajax({
                                url: `${CP_API_URL}/user/comment/deleteComment`,
                                type: "GET",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    "Authorization": "Basic " + btoa(res.token + ":")
                                },
                                data: {commentId}
                            }).then((data, textStatus, jqXHR) => {
                                const res = Object.assign(data, {textStatus});
                                resolve(res);
                            },(jqXHR, textStatus, errorThrown) => {
                                let res = null;
                                if (jqXHR.status === 500)
                                {
                                    res={textStatus, message: "服务器500错误"}
                                }
                                else
                                {
                                    res = Object.assign(jqXHR.responseJSON, {textStatus});
                                }
                                resolve(res);
                            });
                        }
                        else
                        {
                            resolve({textStatus: "error", code: -1});
                        }
                    });
                }
                else
                {
                    let res = null;
                    if (jqXHR.status === 500)
                    {
                        res={textStatus, message: "服务器500错误"}
                    }
                    else
                    {
                        res = Object.assign(jqXHR.responseJSON, {textStatus});
                    }
                    resolve(res);
                }
            });
        });
    }

}
