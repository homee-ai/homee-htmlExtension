'use strict';
import { Plugin } from '../glitterBundle/plugins/plugin-creater.js';
import { ClickEvent } from "../glitterBundle/plugins/click-event.js";
import { SharedView } from "../homee/shareView.js";
import { appConfig } from "../config.js";
import { Dialog } from "../homee/legacy/widget/dialog.js";
import { Category } from "../api/category.js";
import { ViewModel } from "./view/categoryViewApi.js";
import { Api } from '../homee/api/homee-api.js';
import { ProductSharedView } from "../product/shareView.js";
Plugin.create(import.meta.url, (glitter) => {
    const api = {
        upload: (photoFile, callback) => {
            $.ajax({
                url: Api.serverURL + '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}` }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: photoFile,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            glitter.share.dialog.dataLoading({ visible: false });
                            glitter.share.dialog.successMessage({ text: "上傳成功" });
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                            glitter.share.dialog.successMessage({ text: "上傳失敗" });
                        },
                    });
                },
                error: (err) => {
                    glitter.share.dialog.successMessage({ text: "上傳失敗" });
                },
            });
        }
    };
    return {
        nav: {
            defaultData: {
                searchDefault: "大家都在搜尋:沙發"
            },
            render: (gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getTopInset", {}, (response) => {
                    var _a;
                    if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.topInset) != response.data) {
                        widget.data.topInset = response.data;
                        widget.refreshAll();
                    }
                }, {
                    webFunction: () => {
                        return { data: 10 };
                    }
                });
                return {
                    view: () => {
                        const sharedView = new SharedView(gvc);
                        return sharedView.navigationBar({
                            title: ``,
                            leftIcon: `<img class="" src="${new URL('../img/component/left-arrow.svg', import.meta.url).href}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                if (gvc.glitter.pageConfig.length <= 1) {
                                    appConfig().setHome(gvc, "home", {});
                                }
                                else {
                                    gvc.glitter.goBack();
                                }
                            })}">
                            <div class="  form-control flex-fill" style="
border-radius: 20px;
font-family: 'Noto Sans TC';
padding-left: 30px;
font-style: normal;
font-weight: 400;
background: url(https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061987473) no-repeat scroll 7px 7px,rgba(41, 41, 41, 0.1);;
background-size: 20px;
font-size: 14px;
line-height: 150%;
color: #858585;
width: calc(100vw - 180px);
" placeholder="${widget.data.searchDefault}" onclick="${gvc.event(() => {
                                glitter.changePage(new URL('../homee/jspage/search-page.js', import.meta.url).href, 'searchPage', true, {}, { animation: glitter.animation.fade });
                            })}" >${widget.data.searchDefault}</div>
                            `,
                            rightIcon: `
                             <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061894470" style="width: 28px;height: 28px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("noticeBell", {}, () => { });
                            })}">
                                <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675061418331" style="width: 28px;height: 28px;" alt="" onclick="${gvc.event(() => {
                                glitter.runJsInterFace("qrcodeScanner", {}, () => { });
                            })}">
                            `
                        });
                    },
                    editor: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "預設搜尋內容",
                                default: widget.data.searchDefault,
                                placeHolder: "大家都在搜尋:沙發",
                                callback: (text) => {
                                    widget.data.searchDefault = text;
                                    widget.refreshAll();
                                }
                            }),
                        ]);
                    }
                };
            },
        },
        banner: {
            defaultData: {
                dataList: [
                    { title: "精選人氣商品", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063161788" },
                    { title: "岩板餐桌系列", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063296082" },
                    { title: "本週新品（ NEW ）", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675063314153" }
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `);
                return {
                    view: () => {
                        return `
                        <div class="w-100 d-flex" style="padding: 16px;">
                            <div class="w-50 banner-card" style="margin-right:7px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[0].img});position: relative" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: widget.data.dataList[0]
                            });
                        })}">
                                <div class="bannerTitle">${widget.data.dataList[0].title}</div>
                            </div>
                            <div class="w-50 d-flex flex-column" style="margin-left: 7px;" >
                                <div class="banner-card" style="margin-bottom:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[1].img});position: relative;" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: widget.data.dataList[1]
                            });
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[1].title}</div>
                                </div>
                                <div class="banner-card" style="margin-top:6px;padding-top: 50%;background:50% / cover url(${widget.data.dataList[2].img});position: relative;" onclick="${gvc.event(() => {
                            ClickEvent.trigger({
                                gvc, widget, clickEvent: widget.data.dataList[2]
                            });
                        })}">
                                    <div class="bannerTitle">${widget.data.dataList[2].title}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    },
                    editor: () => {
                        return gvc.map(widget.data.dataList.map((dd, index) => {
                            return `<div class="alert alert-dark mt-2">
                                ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `banner標題${index + 1}`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    dd.title = text;
                                    widget.refreshAll();
                                }
                            })}
                                
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">banner圖片${index + 1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2 " style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            dd.img = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                                </div>
                            ${ClickEvent.editer(gvc, widget, dd)}
                            </div>`;
                        }));
                    }
                };
            }
        },
        category12: {
            defaultData: {
                dataList: [
                    { title: "餐桌", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159", toPage: "" },
                    { title: "椅子", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700", toPage: "" },
                    { title: "沙發", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671", toPage: "" },
                    { title: "茶几", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072593723", toPage: "" },
                    { title: "TERA\n系統儲物", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992", toPage: "" },
                    { title: "BANFF\n系統儲物", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712", toPage: "" },
                    { title: "床架", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832", toPage: "" },
                    { title: "裝飾畫", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256", toPage: "" },
                    { title: "生活用品", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565", toPage: "" },
                    { title: "全部", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031", toPage: "" },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                gvc.addStyle(`
                        .bannerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 14px;
                            line-height: 20px;
                            color: #292929;
                            
                            position:absolute;
                            top:8px;
                            left:12px;
                            
                        }
                        .banner-card{
                            border-radius: 12px;
                        }
                    `);
                return {
                    view: () => {
                        return gvc.bindView({
                            bind: "bookcase",
                            view: () => {
                                let returnHTML = gvc.map(widget.data.dataList.map((data) => {
                                    return `
                                     <div class="d-flex flex-column " style="width:20%;padding-right: 16px;" onclick="${gvc.event(() => {
                                        ClickEvent.trigger({
                                            gvc, widget, clickEvent: data
                                        });
                                    })}">                                        
                                        <div style="width:64px;height:64px;border-radius: 18px;width:100%;height:auto;padding: 0 4px 100%;background: #FBF9F6 url(${data.img}) no-repeat center;background-size: contain;margin-right: 18px;"></div>
                                        <div class="w-100 d-flex align-items-center justify-content-center" style="font-family: 'Noto Sans TC';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 100%;
white-space: normal;
word-break: break-all;
display: flex;
align-items: center;
text-align: center;
margin-bottom: 16px;
margin-top: 4px;
color: #1E1E1E;">${data.title}</div>
                                    </div>
                                
                                `;
                                }));
                                return `
                            <div style="margin-bottom:12px;padding-left:16px;font-weight: 700;font-size: 18px;line-height: 26px;color: #1E1E1E;">品類</div>
                            <div class="d-flex flex-wrap" style="padding-left:16px;">
                            ${returnHTML}
                            </div>
                        `;
                            },
                            divCreate: { class: `d-flex flex-column `, style: `margin-top:16px;` }
                        });
                    },
                    editor: () => {
                        return `<div class="d-flex flex-column">                   
                        ${gvc.map(widget.data.dataList.map((dd, index) => {
                            return `
                            <div class="d-flex flex-column my-3 alert alert-dark">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;display: inline-block" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1);
                                widget.refreshAll();
                            })}"></i>區塊${index + 1}
                                </div>
                                ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `標題${index + 1}`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            })}     
                                 <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片${index + 1}</h3>
                                    <div class="mt-2"></div>
                                    <div class="d-flex align-items-center mb-3">
                                        <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].img}">
                                        <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                        <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'image/*',
                                    callback(data) {
                                        appConfig().uploadImage(data[0].file, (link) => {
                                            widget.data.dataList[index].img = link;
                                            widget.refreshAll();
                                        });
                                    }
                                });
                            })}"></i>
                                    </div>
                                ${ClickEvent.editer(gvc, widget, dd)}  
                            </div>                 
                                `;
                        }))}
                        ${(() => {
                            gvc.addStyle(`
                                    .add-btn:hover{
                                        cursor: pointer;
                                    }
                                `);
                            return `
                                    <div class="add-btn text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                widget.data.dataList.push({ img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`, title: ``, toPage: `` });
                                widget.refreshAll();
                            })}">添加目錄區塊</div>
                                `;
                        })()}
                    </div>`;
                    }
                };
            }
        },
        footer: {
            defaultData: {
                dataList: [
                    {
                        title: "首頁",
                        icon: new URL('../img/component/footer/home.svg', import.meta.url).href,
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
                        icon: new URL('../img/component/footer/user.svg', import.meta.url).href,
                        toPage: "",
                        click: () => {
                        }
                    },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                glitter.runJsInterFace("getBottomInset", {}, (response) => {
                    var _a;
                    if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.bottomInset) != response.data) {
                        widget.data.bottomInset = response.data;
                        widget.refreshAll();
                    }
                }, {
                    webFunction: () => {
                        return { data: 10 };
                    }
                });
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
                    `);
                return {
                    view: () => {
                        return `
                        <footer class="d-flex align-items-center justify-content-around w-100" style="padding-bottom: ${widget.data.bottomInset}px;position: fixed;bottom: 0px;left: 0px;">
                            ${(() => {
                            return gvc.map(widget.data.dataList.map((data, index) => {
                                return `
                                <div class="d-flex flex-column align-items-center" onclick="${gvc.event((e) => {
                                    ClickEvent.trigger({
                                        gvc, widget, clickEvent: data
                                    });
                                })}">
                                    <img src=${data.icon} style="width: 28px;height: 28px;">
                                    <div class="footerTitle ${(() => { if (index == 0)
                                    return "selected"; })()}">${data.title}</div>
                                </div>
                                `;
                            }));
                        })()}
                        </footer>
                    `;
                    },
                    editor: () => {
                        return gvc.map(widget.data.dataList.map((dd, index) => {
                            return glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `footer icon ${index + 1}`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            }) +
                                `
                                <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">icon圖片${index + 1}</h3>
                                <div class="mt-2"></div>
                                <div class="d-flex align-items-center mb-3">
                                    <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.dataList[index].icon}">
                                    <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                    <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    glitter.ut.chooseMediaCallback({
                                        single: true,
                                        accept: 'image/*',
                                        callback(data) {
                                            glitter.share.publicInterface["glitter"].upload(data[0].file, (link) => {
                                                widget.data.dataList[index].icon = link;
                                                widget.refreshAll();
                                            });
                                        }
                                    });
                                })}"></i>
                                </div>
                            `
                                + ClickEvent.editer(gvc, widget, dd);
                        }));
                    }
                };
            }
        },
        subCategory: {
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        var _a, _b, _c, _d, _e;
                        let isScrollListenerRegistered = false;
                        gvc.addStyle(`     
                        nav{
                            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
                        }
                
                        main {
                            padding: 24px 35px 44px;
                      
                            font-family: 'Noto Sans TC';
                            margin: 0;
                            box-sizing: border-box;
                        }
                        .sortRawText{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 13px;
                            line-height: 19px;
                            /* identical to box height */
                            
                            display: flex;
                            align-items: center;
                            text-align: center;
                            
                            /* HOMEE dark grey */
                            
                            color: #858585;
                
                        }
                        a{
                        
                        }
                
                        `);
                        const gBundle = (_c = (((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.obj.data.object) && ((_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj.data))) !== null && _c !== void 0 ? _c : { "title": "本週新品", "object": { "link": "https://mitblog.pixnet.net/blog/post/37708222", "name": "本週新品", "value": "gid://shopify/Collection/435249512748", "clickEvent": { "src": "$homee/homee/event.js", "route": "category" }, "selectPage": { "tag": "product_show", "name": "產品展示頁面", "group": "產品頁" }, "subCategory": [{ "name": "銀標福利品", "value": "gid://shopify/Collection/435260719404" }, { "name": "布沙發 ( 更多商品即將更新 )", "value": "gid://shopify/Collection/432946676012" }] }, "category": "sub_category_id", "index": 0 };
                        const viewModel = {
                            select: (_d = gBundle.selectIndex) !== null && _d !== void 0 ? _d : 0,
                            setSubCategoryRow: (category) => {
                                gvc.addStyle(`
                                .subcateTitle{
                                    font-weight: 400;
                                    font-size: 14px;
                                    line-height: 20px;
                                    display: flex;
                                    align-items: center;
                                    text-align: center;
                                    /* HOMEE dark grey */
                                    margin-left: 16px;
                                    color: #858585;
                                }
                                .selectTitle{
                                    /* HOMEE black */
                                    color: #292929;
                                    font-weight: 700;
                                }
                            `);
                                return gvc.bindView({
                                    bind: "subCategoryRow",
                                    view: () => {
                                        var _a;
                                        return gvc.map([].concat((_a = gBundle.object.subCategory) !== null && _a !== void 0 ? _a : []).map((data, index) => {
                                            return `
                                            <div class="subcateTitle ${(viewModel.select === index) ? `selectTitle` : ``}" style="" onclick="${gvc.event(() => {
                                                viewModel.loading = true;
                                                viewModel.select = index;
                                                gvc.notifyDataChange('mainView');
                                                gvc.notifyDataChange('cardGroup');
                                                gvc.notifyDataChange('subCategoryRow');
                                            })}">
                                                ${data["name"]}
                                                
                                            </div>
                                `;
                                        }));
                                    }, divCreate: { class: `d-flex rowBar`, style: `margin-left:8px;overflow-x: scroll;padding-right:8px;` },
                                    onCreate: () => {
                                        const parent = document.querySelector('.rowBar');
                                        const center = document.querySelector('.selectTitle');
                                        const centerOffsetLeft = center.offsetLeft;
                                        const centerWidth = center.offsetWidth;
                                        const parentWidth = parent.offsetWidth;
                                        let sumWidth = 0;
                                        let scrollTo = 0;
                                        const children = Array.from(parent.children);
                                        for (const data of children) {
                                            let child = data;
                                            sumWidth += child.offsetWidth + parseInt(window.getComputedStyle(child).marginLeft);
                                            if (child.offsetLeft + child.offsetWidth / 2 >= centerOffsetLeft + centerWidth / 2) {
                                                scrollTo = sumWidth - parentWidth / 2 - child.offsetWidth / 2 - parseInt(window.getComputedStyle(child).marginLeft);
                                                break;
                                            }
                                        }
                                        parent.scrollLeft = scrollTo;
                                    }
                                });
                            },
                            loading: true,
                            product: [],
                            allData: []
                        };
                        let sortSelect = 0;
                        let title = (_e = gBundle.title) !== null && _e !== void 0 ? _e : "分類頁";
                        let sortPriceOrder = -1;
                        let origData = [];
                        let cursor = "";
                        let sortBy = "manual";
                        let productSharedView = new ProductSharedView(gvc);
                        const handleScroll = () => {
                        };
                        glitter.share.productData = {};
                        function resetSort() {
                            sortRow[2].img = new URL('../img/sample/category/sort.svg', import.meta.url).href;
                            sortPriceOrder = -1;
                        }
                        function handleClick(event) {
                            if (viewModel.loading) {
                                return;
                            }
                            if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight && cursor) {
                                isScrollListenerRegistered = true;
                                const id = gBundle.object.subCategory[viewModel === null || viewModel === void 0 ? void 0 : viewModel.select].value;
                                viewModel.loading = true;
                                new Category(glitter).getPageCategoryData("sub_category_id", id, 6, cursor, (response) => {
                                    cursor = "";
                                    viewModel.product.push(response["product_list"]);
                                    if (response["product_list"].length == 0) {
                                        let spinnerBlcok = document.querySelector('.spinnerBlcok');
                                        spinnerBlcok.classList.add("d-none");
                                        viewModel.loading = true;
                                    }
                                    response["product_list"].forEach((productData) => {
                                        let element = productSharedView.productCard({ class: ``, style: `` }, productData);
                                        let leftElement = document.querySelector('.left-line');
                                        let rightElement = document.querySelector('.right-line');
                                        if (leftElement.getBoundingClientRect().height <= rightElement.getBoundingClientRect().height) {
                                            leftElement.innerHTML += element;
                                        }
                                        else {
                                            rightElement.innerHTML += element;
                                        }
                                    });
                                    cursor = response["cursor"];
                                    viewModel.loading = false;
                                }, sortBy);
                            }
                        }
                        let sortRow = [
                            (() => {
                                const map = {
                                    text: '精選', img: '', click: (e) => {
                                        const id = gBundle.object.subCategory[viewModel.select].value;
                                        window.scrollTo(0, 0);
                                        viewModel.loading = true;
                                        resetSort();
                                        sortSelect = 0;
                                        sortBy = "manual";
                                        cursor = "";
                                        window.removeEventListener('scroll', handleClick);
                                        new Category(glitter).getPageCategoryData("sub_category_id", id, 6, "", (response) => {
                                            viewModel.product = response["product_list"];
                                            cursor = response["cursor"];
                                            viewModel.loading = false;
                                            let spinnerBlcok = document.querySelector('.spinnerBlcok');
                                            spinnerBlcok.classList.remove("d-none");
                                            gvc.notifyDataChange(['sortBar', 'cardGroup']);
                                        }, sortBy);
                                    }
                                };
                                return map;
                            })(),
                            (() => {
                                const map = {
                                    text: '銷量', img: '', click: (e) => {
                                        const id = gBundle.object.subCategory[viewModel.select].value;
                                        viewModel.loading = true;
                                        resetSort();
                                        sortSelect = 1;
                                        sortBy = "best-selling";
                                        cursor = "";
                                        window.scrollTo(0, 0);
                                        window.removeEventListener('scroll', handleClick);
                                        new Category(glitter).getPageCategoryData("sub_category_id", id, 6, "", (response) => {
                                            viewModel.product = response["product_list"];
                                            cursor = response["cursor"];
                                            viewModel.loading = false;
                                            let spinnerBlcok = document.querySelector('.spinnerBlcok');
                                            spinnerBlcok.classList.remove("d-none");
                                            gvc.notifyDataChange(['sortBar', 'cardGroup']);
                                        }, sortBy);
                                    }
                                };
                                return map;
                            })(),
                            (() => {
                                const map = {
                                    text: '價格', img: new URL('../img/sample/category/sort.svg', import.meta.url).href, click: (e) => {
                                        const id = gBundle.object.subCategory[viewModel.select].value;
                                        window.scrollTo(0, 0);
                                        sortSelect = 2;
                                        sortPriceOrder *= -1;
                                        cursor = "";
                                        let spinnerBlcok = document.querySelector('.spinnerBlcok');
                                        spinnerBlcok.classList.remove("d-none");
                                        window.removeEventListener('scroll', handleClick);
                                        if (sortSelect == 2) {
                                            if (sortPriceOrder == 1) {
                                                sortRow[2].img = new URL('../img/sample/category/sortHigher.svg', import.meta.url).href;
                                                sortBy = "price";
                                                new Category(glitter).getPageCategoryData("sub_category_id", id, 6, "", (response) => {
                                                    viewModel.product = response["product_list"];
                                                    cursor = response["cursor"];
                                                    viewModel.loading = false;
                                                    gvc.notifyDataChange(['sortBar', 'cardGroup']);
                                                }, sortBy);
                                            }
                                            else {
                                                sortBy = "price-desc";
                                                sortRow[2].img = new URL('../img/sample/category/sortSmaller.svg', import.meta.url).href;
                                                new Category(glitter).getPageCategoryData("sub_category_id", id, 6, "", (response) => {
                                                    viewModel.product = response["product_list"];
                                                    cursor = response["cursor"];
                                                    viewModel.loading = false;
                                                    gvc.notifyDataChange(['sortBar', 'cardGroup']);
                                                }, sortBy);
                                            }
                                        }
                                        viewModel.product.sort((a, b) => (a.sale_price - b.sale_price) * sortPriceOrder);
                                        gvc.notifyDataChange(['sortBar', 'cardGroup']);
                                    }
                                };
                                return map;
                            })(),
                        ];
                        return (() => {
                            let topInset = 0;
                            let bottomInset = 0;
                            let leftHeight = 0;
                            let rightHeight = 0;
                            glitter.runJsInterFace("getTopInset", {}, (response) => {
                                topInset = response.data;
                                gvc.notifyDataChange(['mainView']);
                            }, {
                                webFunction: () => {
                                    return { data: 0 };
                                }
                            });
                            return gvc.bindView({
                                bind: `mainView`,
                                view: () => {
                                    var _a, _b, _c;
                                    if (topInset !== undefined && bottomInset !== undefined) {
                                        return `
                                        <nav class="bg-white w-100 position-fixed z-index-99"  style="padding-top: ${topInset - 20}px;width: 100vw;box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);z-index: 9999;">
                                            <div class="d-flex justify-content-around w-100 align-items-center mt-auto" style="margin:0px;height: 63px; padding: 0 16px; background: #FFFFFF;position:relative;">
                                                <div class="me-auto p-0 d-flex align-items-center" style="">
                                                    <img class="" src="https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1676803803897" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                            glitter.goBack();
                                        })}">
                                                </div>
                                                <div class=" d-flex align-items-center justify-content-center translate-middle-y translate-middle-x" style="color: #292929;;position: absolute;top: 50%;   font-family: 'Noto Sans TC';font-style: normal;font-size: 16px;font-weight: 700;">
                                                    ${title}
                                                </div>
                                            
                                            </div>
                                            <banner style="">
                                               ${(((_a = gBundle.object.subCategory) !== null && _a !== void 0 ? _a : []).length > 0) ? viewModel.setSubCategoryRow(gBundle.parent_category_id) : ``}
                    <!--                            todo 之後如果有需要要加東西-->
                                                ${gvc.bindView({
                                            bind: 'sortBar',
                                            view: () => {
                                                let returnHTML = ``;
                                                sortRow.forEach((element, index) => {
                                                    let style = (index == sortSelect) ? "color: #1E1E1E;" : "color: #858585;";
                                                    returnHTML += `
                                                    <div class="sortRawText" style="padding: 0 24px;font-weight: 500;${style}" onclick="${gvc.event((e) => {
                                                        element.click(e);
                                                    })}">
                                                        ${element.text}
                                                        ${gvc.bindView({
                                                        bind: "",
                                                        view: () => {
                                                            if (element.img) {
                                                                return `<img src="${element.img}" style="height: 16px;width: 16px;">`;
                                                            }
                                                            return ``;
                                                        }
                                                    })}
                                                    </div>
                                                    `;
                                                    if (index != sortRow.length - 1) {
                                                        returnHTML += `
                                                                            <div style="background: #858585; height: 5px;width: 1px;"></div>
                                                                        `;
                                                    }
                                                });
                                                return returnHTML;
                                            },
                                            divCreate: { style: `margin-top:${((((_b = gBundle.object.subCategory) !== null && _b !== void 0 ? _b : []).length > 0) ? 24 : 0)}px;padding-bottom:9px;`, class: `d-flex align-items-center` }
                                        })}
                                            </banner>       
                                        </nav>
                                        <main style="background: white;padding-top:${topInset - 20 + ((((_c = gBundle.object.subCategory) !== null && _c !== void 0 ? _c : []).length > 0) ? 150 : 120)}px;padding-left: 23px;padding-right: 23px;">
                                            ${gvc.bindView({
                                            bind: "cardGroup",
                                            view: () => {
                                                if (viewModel.loading) {
                                                    return ``;
                                                }
                                                else {
                                                    return `
                                                        <div class="left-line w-50" style="height:auto; padding-right:8px;"></div>
                                                        <div class="right-line w-50" style="height:auto;padding-left:8px;"></div>                                                        
                                                        `;
                                                }
                                            }, divCreate: { class: `CardGroup d-flex align-items-start` },
                                            onCreate: () => {
                                                let leftElement = document.querySelector('.left-line');
                                                let rightElement = document.querySelector('.right-line');
                                                let CardGroup = document.querySelector('.CardGroup');
                                                if (!viewModel.loading) {
                                                    viewModel.product.forEach((productData) => {
                                                        let element = productSharedView.productCard({ class: ``, style: `` }, productData);
                                                        if (leftElement.getBoundingClientRect().height <= rightElement.getBoundingClientRect().height) {
                                                            leftElement.innerHTML += element;
                                                        }
                                                        else {
                                                            rightElement.innerHTML += element;
                                                        }
                                                    });
                                                    gvc.addStyle(`
                                                            .swiper-pagination-bullet {
                                                                background: #E0E0E0!important;;                    
                                                            }
                                                            .swiper-pagination-bullet-active{
                                                                background: #FE5541!important;;
                                                            }
                                                        `);
                                                    let test = document.querySelector('main');
                                                    window.addEventListener('scroll', handleClick);
                                                }
                                            }
                                        })} 
                                            <div class="w-100 spinnerBlcok">
                                                <div class=" rounded py-5 h-100 d-flex align-items-center flex-column">
                                                    <div class="spinner-border" role="status"></div>
                                                </div>
                                            </div>                                          
                                        </main>                         
                                        `;
                                    }
                                    else {
                                        return `
                            
                        `;
                                    }
                                }, divCreate: { class: ``, style: `min-height : 100vh;padding-bottom:100px;` },
                                onCreate: () => {
                                    if (viewModel.loading) {
                                        if (gBundle.object.subCategory) {
                                            const id = gBundle.object.subCategory[viewModel === null || viewModel === void 0 ? void 0 : viewModel.select].value;
                                            new Category(glitter).getPageCategoryData("sub_category_id", id, 6, "", (response) => {
                                                viewModel.product = response["product_list"];
                                                cursor = response["cursor"];
                                                viewModel.allData.push(response);
                                                viewModel.loading = false;
                                                gvc.notifyDataChange(['cardGroup']);
                                            }, sortBy);
                                            viewModel.allData.push([]);
                                        }
                                        else {
                                            viewModel.loading = false;
                                        }
                                    }
                                }
                            });
                        })();
                    },
                    editor: () => {
                        return ``;
                    }
                };
            }
        },
        indexStatic: {
            defaultData: {
                selectIndex: 0,
                loading: false,
                leftList: [],
            },
            render: (gvc, widget, setting, hoverID) => {
                let topInset = 0;
                let bottomInset = 0;
                const dialog = new Dialog(gvc);
                let shareView = new SharedView(gvc);
                const viewModel = new ViewModel(gvc);
                const categoryAPI = new Category(gvc.glitter);
                let categoryList = [];
                let loading = false;
                return {
                    view: () => {
                        gvc.addStyle(`
                            @font-face {
                                font-family: 'Noto Sans TC';
                                src: url(assets/Font/NotoSansTC-Bold.otf);
                                font-weight: bold;
                            }
                    
                            @font-face {
                                font-family: 'Noto Sans TC';
                                src: url(assets/Font/NotoSansTC-Regular.otf);
                                font-weight: normal;
                            }
                    
                            html {
                                width: 100%;
                                height: 100%;
                                background: #F8F3ED;
                                overflow-y: auto;
                                background : white;
                            }
                    
                            body {
                                width: 100%;
                                height: 100%;
                                background : white;
                                
                            }
                    
                            main {
                                padding: 24px 35px 44px;
                           
                                font-family: 'Noto Sans TC';
                                margin: 0;
                                box-sizing: border-box;
                                height:100vh;
                            }
                            
                            `);
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                ${shareView.navigationBar({
                                    title: "分類",
                                    leftIcon: `<img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                        if (gvc.glitter.pageConfig.length <= 1) {
                                            appConfig().setHome(gvc, "home", {});
                                        }
                                        else {
                                            gvc.glitter.goBack();
                                        }
                                    })}">`,
                                    rightIcon: `                        
                                    `
                                })}
                                ${gvc.bindView({
                                    bind: 'mainDom',
                                    view: () => {
                                        if (loading) {
                                            return `              
                                            <div style="padding-left: 15px;"></div>                                                                 
                                            ${gvc.bindView({
                                                bind: "leftMain",
                                                view: () => {
                                                    gvc.addStyle(`
                a {
                  all: initial;
                }
                .left-title *{
                    width: 100%;
                    height: 56px;
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 120%;
                    word-break: break-word;
                    white-space:pre-line;  
                    color: #858585;
                }
                .selectClass *{
                    font-family: 'Noto Sans TC';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 100%;
                    /* HOMEE red */
                    color: #FD6A58;
                }
            `);
                                                    let returnData = ``;
                                                    return viewModel.setCategoryLeft(categoryList, widget.data);
                                                },
                                                divCreate: { style: `width:30%;border-right: 0.5px solid #E0E0E0;position:fixed;overflow-y: scroll;padding-left: 15px;padding-right: 15px;`, class: `h-100` }
                                            })}
                                            ${gvc.bindView({
                                                bind: "rightMain",
                                                view: () => {
                                                    let returnHtml = ``;
                                                    categoryList.forEach((data) => {
                                                        returnHtml += viewModel.setCategoryRight(data);
                                                    });
                                                    returnHtml += `
                                                    <div class="w-100" style="height: 30vh"></div>
                                                `;
                                                    return returnHtml;
                                                },
                                                divCreate: { style: `width:70%;overflow-y:scroll;position:fixed;margin-left:26%`, class: `h-100` },
                                                onCreate: () => {
                                                    let div = document.getElementById(`${gvc.id('rightMain')}`);
                                                    div === null || div === void 0 ? void 0 : div.addEventListener("scroll", (e) => {
                                                        let distance = div.scrollTop;
                                                        let elementNodes = [];
                                                        for (let i = 0; i < div.childNodes.length; i++) {
                                                            if (div.childNodes[i].nodeType === 1) {
                                                                elementNodes.push(div.childNodes[i]);
                                                            }
                                                        }
                                                        for (let i = 0; i < elementNodes.length; i++) {
                                                            let e = elementNodes[i];
                                                            if (distance < e.offsetTop - 50) {
                                                                if (widget.data.selectIndex != i - 1) {
                                                                    widget.data.selectIndex = i - 1;
                                                                    gvc.notifyDataChange('leftMain');
                                                                }
                                                                break;
                                                            }
                                                        }
                                                    });
                                                }
                                            })}                             
                                        `;
                                        }
                                        else {
                                            return viewModel.loadingView();
                                        }
                                    },
                                    divCreate: { style: `min-height:100vh;`, class: `d-flex w-100` }
                                })}     
                        `;
                            },
                            divCreate: { class: `d-flex w-100 flex-column`, style: `` },
                            onCreate: () => {
                                const api = new Api();
                                if (!loading) {
                                    categoryAPI.getCategoryAllList((data) => {
                                        data.forEach((element) => {
                                            if (!widget.data.loading) {
                                                widget.data.leftList.push(element.name);
                                            }
                                        });
                                        widget.data.loading = true;
                                        categoryList = data;
                                        loading = true;
                                        gvc.notifyDataChange('mainDom');
                                    });
                                }
                            }
                        });
                    },
                    editor: () => {
                        return ``;
                    }
                };
            },
        },
        indexDynamic: {
            defaultData: {
                selectIndex: 0,
                dataList: [
                    { title: "人氣活動", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700", toPage: "" },
                    { title: "桌子", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675071897159", toPage: "" },
                    { title: "沙發", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072481671", toPage: "" },
                    { title: "椅子", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072457700", toPage: "" },
                    { title: "TERA\n系統儲物", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072618992", toPage: "" },
                    { title: "BANFF\n系統儲物", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072650712", toPage: "" },
                    { title: "床組/寢具", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072676832", toPage: "" },
                    { title: "居家生活", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072699256", toPage: "" },
                    { title: "生活方式", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072721565", toPage: "" },
                    { title: "福利品專區", img: "https://stg-homee-api-public.s3.amazonaws.com/scene/undefined/1675072765031", toPage: "" },
                ],
            },
            render: (gvc, widget, setting, hoverID) => {
                let topInset = 0;
                let bottomInset = 0;
                const dialog = new Dialog(gvc);
                let shareView = new SharedView(gvc);
                const viewModel = new ViewModel(gvc);
                let categoryList = [];
                let loading = true;
                return {
                    view: () => {
                        gvc.addStyle(`
                            @font-face {
                                font-family: 'Noto Sans TC';
                                src: url(assets/Font/NotoSansTC-Bold.otf);
                                font-weight: bold;
                            }
                    
                            @font-face {
                                font-family: 'Noto Sans TC';
                                src: url(assets/Font/NotoSansTC-Regular.otf);
                                font-weight: normal;
                            }
                    
                            html {
                                width: 100%;
                                height: 100%;
                                background: #F8F3ED;
                                overflow-y: auto;
                                background : white;
                            }
                    
                            body {
                                width: 100%;
                                height: 100%;
                                background : white;
                                
                            }
                    
                            main {
                                padding: 24px 35px 44px;
                           
                                font-family: 'Noto Sans TC';
                                margin: 0;
                                box-sizing: border-box;
                                height:100vh;
                            }
                            
                            `);
                        return gvc.bindView({
                            bind: `mainView`,
                            view: () => {
                                return `
                                ${shareView.navigationBar({
                                    title: "分類",
                                    leftIcon: `<img class="" src="${new URL(`../img/sample/idea/left-arrow.svg`, import.meta.url)}" style="width: 24px;height: 24px;margin-right: 16px" alt="" onclick="${gvc.event(() => {
                                        if (gvc.glitter.pageConfig.length <= 1) {
                                            appConfig().setHome(gvc, "home", {});
                                        }
                                        else {
                                            gvc.glitter.goBack();
                                        }
                                    })}">`,
                                    rightIcon: `                        
                                    `
                                })}
                                ${gvc.bindView({
                                    bind: 'mainDom',
                                    view: () => {
                                        if (loading) {
                                            return `              
                                            <div style="padding-left: 15px;"></div>                                                                 
                                            ${gvc.bindView({
                                                bind: "leftMain",
                                                view: () => {
                                                    gvc.addStyle(`
                                                        a {
                                                          all: initial;
                                                        }
                                                        .left-title *{
                                                            width: 100%;
                                                            height: 56px;
                                                            font-family: 'Noto Sans TC';
                                                            font-style: normal;
                                                            font-weight: 400;
                                                            font-size: 15px;
                                                            line-height: 120%;
                                                            word-break: break-word;
                                                            white-space:pre-line;  
                                                            color: #858585;
                                                        }
                                                        .selectClass *{
                                                            font-family: 'Noto Sans TC';
                                                            font-style: normal;
                                                            font-weight: 700;
                                                            font-size: 17px;
                                                            line-height: 100%;
                                                            /* HOMEE red */
                                                            color: #FD6A58;
                                                        }
                                                    `);
                                                    let returnData = ``;
                                                    widget.data.dataList.forEach((data, index) => {
                                                        let selectClass = (index == widget.data.selectIndex) ? "selectClass" : "";
                                                        returnData += `
                                                        <div class="left-title  ${selectClass}" onclick="${gvc.event(() => {
                                                            widget.data.selectIndex = index;
                                                            gvc.notifyDataChange('leftMain');
                                                            gvc.notifyDataChange('rightMain');
                                                        })}">                        
                                                            <a class="d-flex align-items-center justify-content-start" target="_self" href="#pageIndex${data.title}"
                                                            style="color:${(index == widget.data.selectIndex) ? `#FD6A58` : `#858585`};text-decoration: inherit;" onclick="${gvc.event(() => {
                                                            event === null || event === void 0 ? void 0 : event.preventDefault();
                                                            const section1 = document.getElementById(`pageIndex${data.title}`);
                                                            section1 === null || section1 === void 0 ? void 0 : section1.scrollIntoView({ behavior: "smooth" });
                                                        })}"
                                                            >${data.title}</a>
                                                        </div>
                                                    `;
                                                    });
                                                    return `
                                                        <div class="d-flex flex-column w-100">
                                                            ${returnData}
                                                        </div>
                                                    `;
                                                },
                                                divCreate: { style: `width:30%;border-right: 0.5px solid #E0E0E0;position:fixed;overflow-y: scroll;padding-left: 15px;padding-right: 15px;`, class: `h-100` }
                                            })}
                                            ${gvc.bindView({
                                                bind: "rightMain",
                                                view: () => {
                                                    let returnHtml = ``;
                                                    widget.data.dataList.forEach((data) => {
                                                        var _a;
                                                        let title = (_a = data.pageTitile) !== null && _a !== void 0 ? _a : data.title;
                                                        let dataList = data.subCategory;
                                                        gvc.addStyle(`
                                                            .rightCategoryTitle{
                                                                height: 25px;
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 500;
                                                                font-size: 17px;
                                                                line-height: 25px;
                                                                color: #292929;
                                                               
                                                            }
                                                            .cardTitle{
                                                                height: 40px;
                                                                font-family: 'Noto Sans TC';
                                                                font-style: normal;
                                                                font-weight: 400;
                                                                font-size: 14px;
                                                                line-height: 120%;
                                                                color: #292929;
                                                                word-break: break-word;
                                                                white-space:pre-line;  
                                            
                                                            }
                                                        `);
                                                        let CardGroup = ``;
                                                        if (dataList) {
                                                            dataList.forEach((element, index) => {
                                                                var _a;
                                                                let margin = (index % 2) ? "" : "margin-right: 22px;";
                                                                if (element.name) {
                                                                    CardGroup += `
                                                                    <div class="rounded" style="width: calc(50% - 11px); ${margin}" onclick="${gvc.event((e) => {
                                                                        data.subCategory.forEach((sub) => {
                                                                            sub.name = (sub.appearText) ? sub.appearText : sub.name;
                                                                        });
                                                                        appConfig().changePage(gvc, "sub_category", {
                                                                            title: title,
                                                                            object: data,
                                                                            category: "sub_category_id",
                                                                            selectIndex: index
                                                                        });
                                                                    })}">
                                                                        <div class="w-100 rounded" style="padding-top: 86%;background:50% / cover url(${element.img})"></div>
                                                                        <div class="cardTitle d-flex justify-content-center align-items-baseline mt-1 text-center">${(_a = element === null || element === void 0 ? void 0 : element.appearText) !== null && _a !== void 0 ? _a : element.name}</div>
                                                                    </div>
                                                                    `;
                                                                }
                                                            });
                                                        }
                                                        returnHtml += `
                                                            <div class="d-flex flex-column" style="padding:40px 16px 24px 24px;">
                                                                <div class="d-flex rightCategoryTitle" id="pageIndex${title}">${title}</div>
                                                                <div class="d-flex flex-wrap w-100">
                                                                    ${CardGroup}
                                                                </div>
                                                            </div>
                                                        `;
                                                    });
                                                    returnHtml += `
                                                        <div class="w-100" style="height: 30vh"></div>
                                                    `;
                                                    return returnHtml;
                                                },
                                                divCreate: { style: `width:70%;overflow-y:scroll;position:fixed;margin-left:26%`, class: `h-100` },
                                                onCreate: () => {
                                                    let div = document.getElementById(`${gvc.id('rightMain')}`);
                                                    div === null || div === void 0 ? void 0 : div.addEventListener("scroll", (e) => {
                                                        let distance = div.scrollTop;
                                                        let elementNodes = [];
                                                        for (let i = 0; i < div.childNodes.length; i++) {
                                                            if (div.childNodes[i].nodeType === 1) {
                                                                elementNodes.push(div.childNodes[i]);
                                                            }
                                                        }
                                                        for (let i = 0; i < elementNodes.length; i++) {
                                                            let e = elementNodes[i];
                                                            if (distance < e.offsetTop - 50) {
                                                                if (widget.data.selectIndex != i - 1) {
                                                                    widget.data.selectIndex = i - 1;
                                                                    gvc.notifyDataChange('leftMain');
                                                                }
                                                                break;
                                                            }
                                                        }
                                                    });
                                                }
                                            })}                             
                                        `;
                                        }
                                        else {
                                            return viewModel.loadingView();
                                        }
                                    },
                                    divCreate: { style: `min-height:100vh;`, class: `d-flex w-100` }
                                })}     
                        `;
                            },
                            divCreate: { class: `d-flex w-100 flex-column`, style: `` },
                            onCreate: () => {
                            }
                        });
                    },
                    editor: () => {
                        return `${gvc.map(widget.data.dataList.map((dd, index) => {
                            var _a, _b;
                            return `
                            <div class="d-flex flex-column my-3 alert alert-dark">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;display: inline-block" onclick="${gvc.event(() => {
                                widget.data.dataList.splice(index, 1);
                                widget.refreshAll();
                            })}"></i>區塊${index + 1}
                                </div>
                                ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `左標題`,
                                default: dd.title,
                                placeHolder: dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].title = text;
                                    widget.refreshAll();
                                }
                            })}                            
                                 ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `大標題`,
                                default: (_a = dd.pageTitile) !== null && _a !== void 0 ? _a : dd.title,
                                placeHolder: (_b = dd.pageTitile) !== null && _b !== void 0 ? _b : dd.title,
                                callback: (text) => {
                                    widget.data.dataList[index].pageTitile = text;
                                    widget.refreshAll();
                                }
                            })}               
                                ${(() => {
                                let returnHTML = ``;
                                if (dd === null || dd === void 0 ? void 0 : dd.subCategory) {
                                    gvc.map(dd === null || dd === void 0 ? void 0 : dd.subCategory.map((data) => {
                                        var _a;
                                        returnHTML += `
                                            <h3 style="color: white;font-size: 16px;margin-bottom: 10px;" contenteditable="true" class="mt-2" onblur="${gvc.event((e) => {
                                            data.appearText = e.innerHTML;
                                            widget.refreshAll();
                                        })}">${(_a = data === null || data === void 0 ? void 0 : data.appearText) !== null && _a !== void 0 ? _a : data.name}</h3>
                                            <div class="mt-2"></div>
                                            <div class="d-flex align-items-center mb-3">
                                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${data.img}">
                                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${gvc.event(() => {
                                            glitter.ut.chooseMediaCallback({
                                                single: true,
                                                accept: 'image/*',
                                                callback(imgData) {
                                                    appConfig().uploadImage(imgData[0].file, (link) => {
                                                        data.img = link;
                                                        widget.refreshAll();
                                                    });
                                                }
                                            });
                                        })}"></i>
                                            </div>
                                            `;
                                    }));
                                }
                                return returnHTML;
                            })()}     
                                ${ClickEvent.editer(gvc, widget, dd)}  
                                </div>
                                
                            </div>                 
                                `;
                        }))}
                        ${(() => {
                            gvc.addStyle(`
                                    .add-btn:hover{
                                        cursor: pointer;
                                    }
                                `);
                            return `
                                    <div class="add-btn text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${gvc.event(() => {
                                widget.data.dataList.push({ img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`, title: ``, toPage: `` });
                                widget.refreshAll();
                            })}">添加目錄區塊</div>
                                `;
                        })()}`;
                    }
                };
            },
        },
    };
});
