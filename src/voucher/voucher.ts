'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {ClickEvent} from "../glitterBundle/plugins/click-event.js";
import {LegacyPage} from "./legacy/interface.js";

Plugin.create(import.meta.url,(glitter)=>{
    const api={
        upload:(photoFile:any,callback:(link:string)=>void)=>{
            glitter.share.dialog.dataLoading({text:'上傳中',visible:true})
            $.ajax({
                url: glitter.share.apiPrefix+'/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name:`${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible:false})
                            glitter.share.dialog.successMessage({text:"上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text:"上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text:"上傳失敗"})
                },
            });
        }
    }
    return {
        nav: {
            defaultData:{
                nav:{
                    leftIcon:import.meta.resolve!('../img/component/left-arrow.svg',import.meta.url),
                    leftPage:"",
                    rightIcon:import.meta.resolve!('../img/component/service.png',import.meta.url),
                    rightPage:""
                },
                voucherPlaceholder:"輸入優惠代碼"
            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    html{
                        margin: 0;
                        box-sizing: border-box;    
                        font-family: 'Noto Sans TC';        
                    }
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    
                `)

                function drawNav (title: string, leftIcon: string, rightIcon: string ):string{
                    glitter.runJsInterFace("getTopInset", {}, (response:any) => {
                        if (widget.data?.topInset != response.data){
                            widget.data.topInset = response.data;
                            widget.refreshAll!();
                        }
                    }, {
                        webFunction: () => {
                            return {data: 10}
                        }
                    })
                    return gvc.bindView({
                        bind: `nav`,
                        view: () => {
                            return `
                    <nav class="bg-white w-100" style="padding-top: ${widget.data.topInset - 20}px;">
                        <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0;height: 63px; padding: 0 16px; background: #FFFFFF;box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);position:relative;">
                            <div class="me-auto p-0 d-flex align-items-center" style="">
                                ${leftIcon}
                            </div>
                            <div class=" d-flex align-items-center justify-content-center" style="font-family: 'Noto Sans TC',serif;font-style: normal;font-size: 16px;font-weight: 700;color: #1E1E1E;">${title}</div>
                            ${(()=>{
                                if (rightIcon){
                                    return `
                                    <div class="d-flex ms-auto align-items-center" style="">
                                        ${rightIcon}
                                    </div>`
                                }else
                                    return ``
                            })()}
                        
                        </div>
                    </nav>
                        `
                        },
                        divCreate: {style:`width:100vw;height:calc(63px + ${widget.data.topInset - 20}px)`},
                        onCreate: () => {
                        }
                    })
                }
                return {
                    view: ()=>{
                        return gvc.map([
                            drawNav("優惠卷",
                                `<img class="" src="${import.meta.resolve!('../img/component/left-arrow.svg',import.meta.url)}" style="width: 24px;height: 24px;" alt="" onclick="${gvc.event(() => {
                                })}">`,
                                `<img class="" src="${import.meta.resolve!('../img/component/service.png',import.meta.url)}" style="width: 24px;height: 24px" alt="" onclick="${gvc.event(() => {
                                })}">`)
                        ])
                    },
                    editor: ()=>{
                        return gvc.map([
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">返回icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.leftIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        api.upload(data[0].file,(link)=>{
                                            widget.data.nav.leftIcon=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `返回的頁面`,
                                default: widget.data.nav.leftPage,
                                placeHolder: widget.data.nav.leftPage,
                                callback: (text: string) => {
                                    widget.data.nav.leftPage = text
                                    widget.refreshAll!()
                                }
                            }),
                            `
                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">右方icon</h3>
                            <div class="my-3 border border-white"></div>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.nav.rightIcon}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                glitter.ut.chooseMediaCallback({
                                    single:true,
                                    accept:'image/*',
                                    callback(data: { file:any;data: any; type: string; name: string; extension: string }[]) {
                                        api.upload(data[0].file,(link)=>{
                                            widget.data.nav.rightIcon=link;
                                            widget.refreshAll()
                                        })
                                    }
                                })
                            })}"></i>
                            </div>
                        `,
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `右方icon跳轉的頁面`,
                                default: widget.data.nav.rightPage,
                                placeHolder: widget.data.nav.rightPage,
                                callback: (text: string) => {
                                    widget.data.nav.rightPage = text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }

                }
            },
        },
        voucherInput:{
            defaultData:{
                voucherPlaceholder:"輸入優惠代碼"
            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .voucherInput{                        
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                    }
                    .voucherInput::placeholder{
                        color: #858585;
                    }
                    .btnInput:hover{
                        cursor: pointer;
                    }
                    
                `)
                return {
                    view: ()=>{
                        return gvc.map([
                            gvc.bindView({
                                bind:"inputVoucherCode",
                                view : ()=>{
                                    return `
                                    <input class="voucherInput w-100 border-0" style="position: relative" placeholder="${widget.data.voucherPlaceholder}">
                                    <div class="btnInput" style="font-weight: 700;font-size: 18px;line-height: 26px;color: #FE5541;position: absolute;right:16px;top: 13px;" onclick="${gvc.event(()=>{
                                        let data = document.querySelector(".voucherInput") as HTMLInputElement;
                                        let value = data.value;
                                        //    todo
                                    })}">
                                        套用
                                    </div>
                                `
                                },
                                divCreate:{style : "margin:24px;padding:13px 16px;border: 1px solid #E0E0E0 ;border-radius: 8px;position: relative;" , class : ""}

                            })

                        ])
                    },
                    editor: ()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `輸入預測文字`,
                                default: widget.data.voucherPlaceholder,
                                placeHolder: widget.data.voucherPlaceholder,
                                callback: (text: string) => {
                                    widget.data.voucherPlaceholder = text
                                    widget.refreshAll!()
                                }
                            }),
                        ])
                    }
                }
            },
        },
        voucherList:{
            defaultData:{
                voucherCardList:[{
                    vendor_id:"0",
                    vendor_icon:import.meta.resolve!('../img/component/voucher/cardIcon.png',import.meta.url),
                    vendor_name:"HOMEE",
                    vendor_context:"優惠券內容",
                    name: "用戶邀請朋友成功獎勵",
                    discount:"現折 10,000 元",
                    lowCostText:"最低消費：",
                    lowCostNumber:"NT$ 30,000",
                    dateText:"有效期限：",
                    date:"31 三月 2025",
                    dateType:"",
                },{
                    vendor_id:"1",
                    vendor_icon:import.meta.resolve!('../img/component/voucher/cardIcon.png',import.meta.url),
                    vendor_name:"HOMEE",
                    vendor_context:"優惠券內容",
                    name: "門市消費滿萬贈 HOMEE $500 優惠券",
                    discount:"現折 500 元",
                    lowCostText:"最低消費：",
                    lowCostNumber:"NT$ 0",
                    dateText:"即將失效：",
                    date:"剩下 8 小時",
                    dateType:"warning-"
                }]
            },
            render:(gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                    .voucherCard{
                        background: #FFFFFF;
                        border-radius: 20px;
                        padding:8px 0;
                        box-shadow: -2px 2px 15px rgba(0, 0, 0, 0.05);
                        margin-bottom:16px;
                        position:relative;
                    }
                    .vendor_name{
                        font-weight: 400;
                        font-size: 15px;
                        color: #1E1E1E;
                    }
                    .vendor_context{
                        padding-top:3px;
                        font-weight: 700;
                        font-size: 12px;
                        color: #FE5541;
                    }
                    .vendor_context:hover{
                        cursor: pointer;
                    }
                    .name{
                        font-weight: 700;
                        font-size: 16px;
                        line-height: 23px;
                        color: #1E1E1E;
                    }
                    .discount{
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 35px;
                        color: #FE5541;
                        margin:4px 0;
                    }
                    .lowCostText{
                        font-weight: 400;
                        font-size: 12px;                        
                        color: #858585;
                    }
                    .lowCostNumber{
                        font-weight: 700;
                        font-size: 12px;
                        color: #1E1E1E;
                    }
                    .dateText{
                        font-weight: 400;
                        font-size: 12px;
                        color: #858585;
                    }
                    .date{
                        font-weight: 700;
                        font-size: 12px;
                        color: #1E1E1E;
                    }
                    .warning-dateText{
                        font-weight: 400;
                        font-size: 12px;
                        color: #FF0000;
                    }
                    .warning-date{
                        font-weight: 700;
                        font-size: 12px;
                        color: #FF0000;
                    }
                    .lackCircle{
                        width:24px;
                        height:24px;
                        border-radius:50%;
                        background:#E5E5E5;  
                    }
                    .leftCircle{                        
                        position:absolute;
                        left:-12px;
                        top:calc(50% - 12px);
                                              
                    }
                    .rightCircle{
                        width:24px;
                        height:24px;
                        border-radius:50%;
                        position:absolute;
                        right:-12px;
                        top:calc(50% - 12px);                      
                    }
                    
                `)

                return {
                    view: ()=>{
                        return gvc.map([
                            gvc.bindView({
                                bind:"voucherCardList",
                                view : ()=>{
                                    return gvc.map(widget.data.voucherCardList.map((data:any)=>{
                                        return `
                                        <div class="voucherCard"> 
                                            <div class="d-flex" style="padding: 8px 22px;">
                                                <img src="${data.vendor_icon}" style="width: 24px;height: 24px;border-radius: 50%;margin-right: 8px;">
                                                <div class="vendor_name">${data.vendor_name}</div>
                                                <div class="vendor_context ms-auto" onclick="${gvc.event(()=>{
                                                    LegacyPage.execute(gvc.glitter,()=>{
                                                        gvc.glitter.changePage(
                                                            LegacyPage.getLink("jsPage/user/couponDetail.js"),
                                                            "subCategory",
                                                            true,
                                                            {})
                                                    })
                                                })}">${data.vendor_context}</div>
                                            </div>
                                            <div class="w-100" style="background: #E0E0E0;height: 1px;"></div>
                                            <div class="" style="padding: 8px 22px;">
                                                <div class="name">${data.name}</div>
                                                <div class="discount">${data.discount}</div>
                                                <div class="d-flex ">
                                                    <div class="lowCostText">${data.lowCostText}</div>
                                                    <div class="lowCostNumber">${data.lowCostNumber}</div>
                                                    <div class="ms-auto d-flex">
                                                        <div class="${data.dateType}dateText">${data.dateText}</div>
                                                        <div class="${data.dateType}date">${data.date}</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div class="lackCircle leftCircle"></div>
                                            <div class="lackCircle rightCircle"></div>
                                        </div>
                                        
                                    `
                                    }))
                                },
                                divCreate:{style : `padding:24px 24px 0;` , class : `w-100`}

                            })

                        ])
                    },
                    editor: ()=>{

                        return ``
                    }
                }
            },
        }

    }
});