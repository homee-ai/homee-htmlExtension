'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {appConfig} from "../config.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";

Plugin.create(import.meta.url, (glitter) => {

    return {
        nav: {
            defaultData: {
                topInset: 10,

            },
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
                        glitter.runJsInterFace("getTopInset", {}, (response) => {
                            if (widget.data.topInset != response.data) {
                                widget.data.topInset = response.data;
                                gvc.notifyDataChange('mainView')
                            }
                        }, {
                            webFunction: () => {
                                return {data: 10}
                            }
                        })
                        return `
                            <div class="w-100 d-flex" style="padding-right: 26px;padding-top: ${10 + widget.data.topInset}px;">
                                ${gvc.bindView(() => {
                            var noticeCount = 0
                            glitter.runJsInterFace("setNotificationBadgeCallBack", {}, (response) => {
                                noticeCount = parseInt(response.data, 10)
                                gvc.notifyDataChange('notification')
                            })
                            return {
                                bind: `notification`,
                                view: () => {
                                    return ` 
                                            <img class="ms-auto" src="${new URL!(`../img/component/notification.svg`, import.meta.url)}" alt="" onclick="${gvc.event(() => {
                                        glitter.runJsInterFace("noticeBell", {}, () => {
                                        })
                                    })}">
                                            ${(noticeCount > 0) ? `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${noticeCount}</div>` : ``}
                                     `
                                },
                                divCreate: {class: `ms-auto position-relative`},
                                onCreate: () => {
                                }
                            }
                        })}
                                <img  src = "${new URL!(`../img/component/setting.svg`, import.meta.url)}" alt="" style="margin-left: 20px" onclick="${gvc.event(() => {
                            glitter.changePage('', "", true, {})
                        })}">
                            </div>
                        `

                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        information: {
            defaultData: {
                userData: {
                    user_id: 12052350,
                    last_name: "Rdtest",
                    first_name: "Rdtes22t",
                    name: "Rdtest Rd",
                    photo: "https://prd-homee-api-public.s3.amazonaws.com/scene/12577227/headPhoto.png",
                    AUTH: ""
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                const vm: {
                    data: any,
                    loading: boolean
                } = {
                    data: {},
                    loading: true
                }
                appConfig().getUserData({
                    callback:(response)=>{
                        vm.data=response
                        vm.loading=false
                    }
                })
                return {
                    view: () => {
                        return `
                        ${gvc.bindView({
                            dataList:[{obj:vm,key:'loading'}],
                            bind: "baseUserInf",
                            view: () => {
                                if (vm.loading) {
                                    return ``
                                }
                                return `
                                <div class="d-flex align-items-center">
                                    <div class="d-flex position-relative">
                                        <img src="${vm.data.photo}" style="width: 88px;height: 88px;left: 8px;top: 0px;border-radius: 50%">
                                        <img src="${new URL!(`../img/component/edit.svg`, import.meta.url)}" style="position: absolute;right: 0;bottom: 0;" onclick="${gvc.event(() => {
                                })}">
                                    </div>
                                    <div class="d-flex flex-column justify-content-center align-baseline" style="margin-left: 32px;">
                                        <div class="d-flex">
                                            <div class="last-name">${vm.data.last_name}</div><div class="first-name">${vm.data.first_name}</div>
                                        </div>
                                        <div class="name">
                                            ${vm.data.name}
                                        </div>
                                    </div>
                                </div>
                                `
                            },
                            divCreate: {style: `margin : 40px 0;padding : 0 27px;`}
                        })}   
                        
                        `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        funRow: {
            defaultData: {
                left: "我的訂單",
                right: "查看全部",
                click: () => {

                },

            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        gvc.addStyle(`
                            .serviceRow{
                                padding : 0px 20px;
                                gap : 8px;
                                           
                                height : 68px;
                                
                                background : #FBF9F6;
                                border-radius : 20px;
                                
                                margin-bottom : 12px;
                            }      
                            .leftText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 500;
                                font-size: 16px;
                                line-height: 23px;
                                
                                /* HOMEE black */
                
                                color: #292929;
                
                            }   
                            .rightText{
                                font-family: 'Noto Sans TC';
                                font-style: normal;
                                font-weight: 400;
                                font-size: 13px;
                                line-height: 14px;
                                /* identical to box height, or 108% */
                                
                                
                                /* HOMEE dark grey */
                                
                                color: #858585;
                
                            }   
                        `)
                        return `
                        <div class="d-flex align-items-center  w-100 serviceRow" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:widget.data
                            })
                        })}">
                            <div class="d-flex me-auto leftText" style="padding-left:2px;height: 29px;align-items: center;" >
                                ${widget.data.left}
                            </div>
                            <div class="d-flex align-items-center ms-auto rightText">
                                ${widget.data.right}
                                <img class="ms-auto" src="${new URL!(`../img/component/angle-right.svg`, import.meta.url)}" alt="" style="width: 16px;height: 16px;">
                            </div>
                        </div>
                        `

                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "左方文字",
                                default: widget.data.left,
                                placeHolder: "請輸入左方文字",
                                callback: (text: string) => {
                                    widget.data.left = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "右方文字",
                                default: widget.data.right,
                                placeHolder: "請輸入右方文字",
                                callback: (text: string) => {
                                    widget.data.right = text
                                    widget.refreshAll()
                                }
                            }),
                            ClickEvent.editer(gvc,widget,widget.data)
                        ])
                    }
                }
            },
        },
        funPuzzle: {
            defaultData: {
                model: [
                    {
                        title: "我的空間",
                        icon: new URL!(`../img/component/footer/homeBlack.svg`, import.meta.url),
                        count: 0,
                        click: () => {

                        }
                    },
                    {
                        title: "我的靈感",
                        icon: new URL!(`../img/component/footer/idea.svg`, import.meta.url),
                        count: 3,
                        click: () => {

                        }
                    },
                    {
                        title: "回饋優惠",
                        icon: new URL!(`../img/component/discount.svg`, import.meta.url),
                        count: 0,
                        click: () => {

                        }
                    }]
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        gvc.addStyle(`
                     .mySpaceCount{
                        width: 16px;
                        height: 16px;
            
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Noto Sans TC';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 10px;
                        line-height: 15px;
                        text-align: center;
                        background: #FD6A58;
                        /* HOMEE white */
            
                        border: 1px solid #FFFFFF;
                        border-radius: 8px;
                        /* HOMEE white */
            
                        color: #FFFFFF;
            
                    }
                    `)
                        return gvc.bindView({
                            bind: "funPuzzle",
                            view: () => {
                                return gvc.map(widget.data.model.map((item: any, index: number) => {
                                    let length = widget.data.model.length;
                                    let width = (100 / length);
                                    let style = (index != length - 1) ? "border-right:1px solid #EAD8C2" : "";

                                    return `
                                    <div class="d-flex flex-column align-items-center" style="width: ${width}%;height: 56px; ${style}" onclick="${gvc.event(() => {
                                        item.click()
                                    })}">
                                        <div style="background: #f8f3ed position: relative;width: 26px;height: 24px;">
                                            ${(() => {
                                        if (item.count != 0) {
                                            return `<div class="mySpaceCount" style="position: absolute;right:-4px;top:-4px;z-index: 5;">${item.count}</div>`
                                        } else {
                                            return ``
                                        }
                                    })()}
                                            <img class="h-100 w-100" src="${item.icon}" style="">
                                        </div>
                                        <div class="indexTitle" style="margin-top: 5px">
                                            ${item.title}
                                        </div>
                                        
                                    </div>
                   
                            `
                                }))
                            }, divCreate: {
                                class: `d-flex justify-content-between `,
                                style: `padding: 28px 20px;border-radius: 20px; gap: 8px; margin-top: 16px;margin-bottom: 12px;background : #FBF9F6;`
                            }
                        })

                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/homeBlack.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "靈感",
                        icon: new URL('../img/component/footer/idea.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "我的空間",
                        icon: new URL('../img/component/footer/myspace.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "購物車",
                        icon: new URL('../img/component/footer/shoopingCart.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },
                    {
                        title: "會員",
                        icon: new URL('../img/component/footer/userRed.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {

                        }
                    },

                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getBottomInset", {}, (response: any) => {
                    if (widget.data?.bottomInset != response.data) {
                        widget.data.bottomInset = response.data;
                        widget.refreshAll!();
                    }
                }, {
                    webFunction: () => {
                        return {data: 10}
                    }
                })
                return {
                    view: () => {
                        gvc.addStyle(`
                        footer{
                            background:white;
                            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                            padding-top:18px;
                        }
                        .footerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                            text-align: center;
                            color: #1E1E1E;
                        }
                        .selected{
                            color:#FE5541;
                        }
                    `)
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;background: #FFFFFF;box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data: any, index: number) => {
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle ${(() => {
                                    if (index == 4) return "selected"
                                })()}">${data.title}</div>
                                </div>
                                `
                            }))
                        })()}
                        </footer>
                    `
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
        empty: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                const data: { link: { img: string, code?: string }[] } = widget.data

                return {
                    view: () => {
                        return ``
                    },
                    editor: () => {
                        return ``
                    }
                }
            },
        },
    }
});