'use strict';
import {Plugin} from '../glitterBundle/plugins/plugin-creater.js'
import {SharedView} from './shareView.js'
import {EditerApi} from "./api/editer-api.js";
import {ClickEvent} from "../glitterBundle/plugins/click-event.js"
import {LegacyPage} from "./legacy/interface.js"
Plugin.create(import.meta.url, (glitter) => {
    const rootURL=new URL("../",import.meta.url).href
    const api = {
        upload: (photoFile: any, callback: (link: string) => void) => {
            glitter.share.dialog.dataLoading({text: '上傳中', visible: true})
            $.ajax({
                url: glitter.share.apiPrefix + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({file_name: `${new Date().getTime()}`}),
                contentType: 'application/json; charset=utf-8',
                headers: {Authorization: glitter.getCookieByName('token')},
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            glitter.share.dialog.dataLoading({visible: false})
                            glitter.share.dialog.successMessage({text: "上傳成功"})
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                            glitter.share.dialog.successMessage({text: "上傳失敗"})
                        },
                    });
                },
                error: (err: any) => {
                    glitter.share.dialog.successMessage({text: "上傳失敗"})
                },
            });
        }
    }
    return {
        banner: {
            defaultData: {
                link: []
            },
            render: (gvc, widget, setting, hoverID) => {
                // glitter.share.clickEvent
                const data: { link: { img: string, code?: string,clickEvent?:any }[] } = widget.data
                function slideControl(pageImgArray: any, pagination: boolean, navigation: boolean, scrollbar: boolean) {
                    const glitter = gvc.glitter
                    gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
        `)
                    let slidePage = ``
                    pageImgArray.forEach((item: any, index: number) => {
                        // <!-- Slides -->
                        slidePage += `
                <div class="swiper-slide" style="padding-bottom: 128%; background:50% / cover url(${item.img});" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc,widget,clickEvent:item
                            })
                        })}">
                </div>
            `
                    })
                    let id = `${glitter.getUUID()}`
                    return `
            <!-- Slider main container -->
            ${gvc.bindView({
                        bind: id,
                        view: () => {
                            return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              ${(() => {
                                if (pagination) {
                                    return `<div class="swiper-pagination"></div>`
                                } else {
                                    return ``
                                }
                            })()}
              ${(() => {
                                if (navigation) {
                                    return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`
                                } else {
                                    return ''
                                }
                            })()}
              ${(() => {
                                if (scrollbar) {
                                    return `<div class="swiper-scrollbar"></div>`
                                } else {
                                    return ``
                                }

                            })()}
              `
                        },
                        divCreate: {class: `swiper ${id}`},
                        onCreate: () => {
                            glitter.addMtScript([{
                                src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                            }], () => {
                                const Swiper = (window as any).Swiper
                                const swiper = new Swiper(`.${id}`, {
                                    // Optional parameters
                                    direction: 'horizontal',
                                    loop: true,

                                    // If we need pagination
                                    pagination: {
                                        el: `.${id} .swiper-pagination`,
                                    },

                                    // Navigation arrows
                                    navigation: {
                                        nextEl: `.${id} .swiper-button-next`,
                                        prevEl: `.${id} .swiper-button-prev`,
                                    },

                                    // And if we need scrollbar
                                    scrollbar: {
                                        el: `.${id} .swiper-scrollbar`,
                                    },


                                });
                            }, () => {
                            })
                        }
                    })}
        `;
                }
                gvc.addStyle(`
            .swiper-pagination-bullet{
            background-color: black !important;
            }
              .swiper-pagination-bullet-active{
            width:8px !important;
            background-color: white  !important;
            }
            `)
                gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
                const editorID = glitter.getUUID()
                return {
                    view: ()=>{return slideControl(data.link, true, false, false)},
                    editor: ()=>{
                        return gvc.map([
                            gvc.bindView({
                        bind: editorID,
                        view: () => {
                            function swapArr(arr: any[], index1: number, index2: number) {
                                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                                return arr;
                            }

                            return `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
${data.link.map((dd, index) => {
                                return `
<div class="alert alert-dark">
<div class="d-flex align-items-center mb-3 mt-1 ">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link.splice(index, 1)
                                    widget.refreshAll()
                                })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.img}">
<div class="d-flex flex-column mx-2">
<i class="fa-duotone fa-up  text-white ${(index === 0) ? `d-none` : ``}"  style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link = swapArr(data.link, index, index - 1)
                                    widget.refreshAll()
                                })}"></i>
<i class="fa-regular fa-down  text-white ${(index === data.link.length - 1) ? `d-none` : ``}" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    data.link = swapArr(data.link, index, index + 1)
                                    widget.refreshAll()
                                })}"></i>
</div>
<div class="" style="width: 1px;height: 25px;background-color: white;"></div>
<i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    glitter.ut.chooseMediaCallback({
                                        single: true,
                                        accept: 'image/*',
                                        callback(data: { file: any; data: any; type: string; name: string; extension: string }[]) {
                                            api.upload(data[0].file, (link) => {
                                                dd.img = link;
                                                widget.refreshAll()
                                            })
                                        }
                                    })
                                })}"></i>
</div>
${ClickEvent.editer(gvc,widget,dd)}
</div>

`
                            }).join(`<div class="w-100 my-3" style="background: white;height: 1px;"></div>`)}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
                                gvc.event(() => {
                                    data.link.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`})
                                    widget.refreshAll()
                                })
                            }">添加輪播圖</div>
`
                        },
                        divCreate: {}
                    })])
                    }
                }
            },
        },
        rankingBlock: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                widget.data.titleStyle = widget.data.titleStyle ?? `font-family: 'Noto Sans TC';
font-style: normal;
color: black;
font-size: 16px;
margin-top: 16px;
margin-left: 12px;
font-weight: 700;`
                widget.data.rank=widget.data.rank ?? [{},{},{}]
                return {
                    view: ()=>{
                        return `
                <div class="" style="background-color: ${widget.data.bgcolor};border-radius:${widget.data.radius}px;">
                <h3 style="${widget.data.titleStyle}">${widget.label}</h3>
                   <div class="d-flex align-items-center justify-content-around " style="width:calc(100% -24px);margin-left: 12px;margin-right: 12px;gap: 8px;padding-bottom: 15px;">
               ${gvc.map(['firstRank.svg', 'secondRank.svg', 'thirdRank.svg'].map((dd,index) => {
                   const data=widget.data.rank[index]
                            data.data = data.data ?? {}
                            return ` <div class="d-flex flex-column align-items-center justify-content-center" style="width:calc(100% - 16px);">
 <div class="bg-white flex-fill position-relative" style="width:100%;border-radius: 8px;padding-bottom: calc(100%);" onclick="${gvc.event(()=>{
                                ClickEvent.trigger({
                                    gvc,
                                    widget,
                                    clickEvent:data
                                })
                            })}">
 <img src="${data.data.preview_image}" class="position-absolute w-100 h-100" style="top: 0px;">
         <img src="${rootURL}img/homeeExtension/${dd}" class="position-absolute" style="top: 0px;">       
</div>
<span class="" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 500;
font-size: 10px;
line-height: 14px;
text-align: center;
margin-top: 4px;
color: #FE5541;">$ ${data.data.sale_price}</span>
</div>`
                        }))}
</div>
</div>
                `
                    },
                    editor: ()=>{
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "背景顏色",
                                default: widget.data.bgcolor,
                                placeHolder: "請輸入背景顏色",
                                callback: (text: string) => {
                                    widget.data.bgcolor = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "倒圓角",
                                default: widget.data.radius,
                                placeHolder: "請輸入圓角幅度",
                                callback: (text: string) => {
                                    widget.data.radius = text
                                    widget.refreshAll()
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: "標題Style",
                                default: widget.data.titleStyle,
                                placeHolder: "請輸入標題Style",
                                callback: (text: string) => {
                                    widget.data.titleStyle = text
                                    widget.refreshAll()
                                }
                            }),
                            gvc.map(widget.data.rank.map((dd:any,index:number)=>{
                                return ClickEvent.editer(gvc,widget,dd,{
                                    option:['toProductDetail'],
                                    hover:true,
                                    title:"點擊事件-"+(index+1)
                                })
                            }))
                        ])
                    }
                }
            }
        },
        productItem: {
            style: "width:calc(50% - 8px);",
            defaultData: {
                "data": {
                    "id": 8837303,
                    "name": "HOVE 雙人床架",
                    "price": 23580,
                    "sale_price": 23580,
                    "preview_image": "https://cdn.store-assets.com/s/349867/i/51305748.png?width=720"
                },
                "clickEvent": {
                    "src": "http://127.0.0.1:3090/test/homee/event.js",
                    "route": "toProductDetail"
                }
            },
            render: (gvc, widget, setting, hoverID) => {
                widget.data.data=widget.data.data ?? {}
                return {
                    view: ()=>{
                        return `<div class="${widget.data.class ?? ""} p-0 " style="${widget.data.style ?? ""} 
height: auto;background: #FBF9F6;border: 4px solid rgba(248, 243, 237, 0.3);
border-radius: 16px;" onclick="${gvc.event(()=>{
      ClickEvent.trigger({
          gvc,
          widget,
          clickEvent:widget.data
      })
                        })}">
<div class=" w-100 m-0" style="
box-sizing:border-box;
border-radius: 16px;
padding-bottom: 100%;background: 50%/cover no-repeat url('${widget.data.data.preview_image}'), white;"></div>
<h3 class="w-100" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 14px;
margin-top: 8px;
word-break: break-word;
white-space: normal;
margin-bottom: 0px;
color: #292929;">${widget.data.data.name ?? "尚未設定"}</h3>
<div class="d-flex align-items-baseline" style="margin-top: 8px;margin-bottom: 8px;">
<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 14px;
color: #FD6A58;
line-height: 150%;">
NT$ ${widget.data.data.price ?? "尚未設定"} up
</span>
<div class="flex-fill"></div>
<span class="${(widget.data.data.price === widget.data.data.sale_price) ? `d-none`:``}" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 14px;
text-align: right;
text-decoration-line: line-through;
color: #858585;" >
 NT$ ${widget.data.data.sale_price}
</span>
</div>

</div>`
                    },
                    editor: ()=>{
                        return gvc.map([
                           ClickEvent.editer(gvc,widget,widget.data,{
                               option:['toProductDetail'],
                               hover:true
                           })
                        ])
                    }
                }
            },
        },
        homeTitleBar: {
            defaultData: {
                logo:{
                    src:``,width:``,height:``
                }
            },
            render: (gvc, widget, setting, hoverID) => {
               const shareView=new SharedView(gvc)
               return {
                   view:()=>{
                       return shareView.navigationBar({
                           title:`<span style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 700;
font-size: 16px;
color: #1E1E1E;
line-height: 150%;">${widget.data.centerText ?? ""}</span>`,
                           leftIcon:`<div class="d-flex align-items-center"><img 
style="
width: ${([undefined,''].indexOf(widget.data.logo.width)!==-1) ? 'auto':widget.data.logo.width};
height: ${([undefined,''].indexOf(widget.data.logo.height)!==-1) ? 'auto':widget.data.logo.height};
"
src="${(!widget.data.logo.src || widget.data.logo.src==='') ? new URL('./src/home_logo.svg',import.meta.url) : widget.data.logo.src}"><h3 class="p-0 m-0" style="${widget.data.titleStyle ?? ""}">${widget.data.title ?? ""}</h3></div>`,
                           rightIcon:`
                       <div class="d-flex align-items-center" style="gap:15px;">
                       <img src="${rootURL}/homee/src/searchBlack.svg" onclick="${gvc.event(()=>{
                               LegacyPage.execute(gvc.glitter,()=>{
                                   glitter.changePage(new URL('./legacy/jsPage/category/category.js', import.meta.url).href,'category',true,{})
                               })
                           })}">
                       <img src="${rootURL}/homee/src/bell.svg" onclick="${gvc.event(()=>{
                               glitter.runJsInterFace("noticeBell",{},()=>{})
                           })}">
                       <img src="${rootURL}/img/component/scan.svg" onclick="${gvc.event(()=>{
                               glitter.runJsInterFace("qrcodeScanner",{},()=>{})
                           })}">
</div>
                       `
                       })
                   },
                   editor:()=>{
                       return gvc.map(
                           [
                               glitter.htmlGenerate.editeInput({
                                   gvc:gvc,
                                   title:"置中內容",
                                   default:widget.data.centerText ?? "",
                                   placeHolder:`請輸入置中內容`,
                                   callback:(text:string)=>{
                                       widget.data.centerText=text
                                       widget.refreshAll()
                                   }
                               }),
                               `
<h3 style="color:white;font-size: 16px;" class="my-2">左側內容</h3>
<div class="alert alert-warning mt-2" role="alert">
${gvc.map([EditerApi.upload("Logo",widget.data.logo.src ?? "",gvc,(text)=>{
                                   widget.data.logo.src=text
                                   widget.refreshAll()
                               }),
                                   `<div class="d-flex align-items-center justify-content-around w-100">
<div class="d-flex align-items-center">
<h3 style="color: white;font-size: 16px;word-break: break-word;white-space: nowrap;" class="m-0 p-0">寬度</h3>
<input class="form-control flex-fill ms-2" style="width: calc(100% - 50px);" value="${widget.data.logo.width ?? ""}" onchange="${gvc.event((e)=>{
                                       widget.data.logo.width=e.value
                                       widget.refreshAll()
                                   })}"></input>
</div>
<div class="d-flex align-items-center ms-2">
<h3 style="color: white;font-size: 16px;word-break: break-word;white-space: nowrap; "  class="m-0 p-0">高度</h3>
<input class="form-control flex-fill ms-2" style="width: calc(100% - 50px);" value="${widget.data.logo.height ?? ""}" onchange="${
                                       gvc.event((e)=>{
                                           widget.data.logo.height=e.value
                                           widget.refreshAll()
                                       })
                                   }"></input>
</div>

</div>`])}
</div>`
                               ,
                               `<div class="alert alert-warning mt-2" >${gvc.map([ glitter.htmlGenerate.editeInput({
                                   gvc:gvc,
                                   title:"標題",
                                   default:widget.data.title,
                                   placeHolder:``,
                                   callback:(text:string)=>{
                                       widget.data.title=text
                                       widget.refreshAll()
                                   }
                               }),
                                   glitter.htmlGenerate.editeText({
                                       gvc:gvc,
                                       title:"標題Style",
                                       default:widget.data.titleStyle,
                                       placeHolder:``,
                                       callback:(text:string)=>{
                                           widget.data.titleStyle=text
                                           widget.refreshAll()
                                       }
                                   })])}</div>`
                           ]
                       )
                   }
               }
            }
        }
    }
});