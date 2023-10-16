import {map, isArray, isString} from 'lodash';
import axios from 'axios';

export function handleData(obj, keyStr = '') {
    if (typeof obj === 'object') {
        return map(obj, (item, key) => {
            let isStringChildren = isString(item)
            const itemKey = keyStr ? `${keyStr}.${key}` : key;
            let children = handleData(item, itemKey)
            if (isString(item)) {
                return {
                    title: `${key} : ${item}`,
                    key: itemKey,
                }
            } else {
                return {
                    title: key,
                    key: itemKey,
                    children: isStringChildren ? null : children,
                }
            }

        })
    } else if (typeof obj === "string") {
        return keyStr + obj
    }
}

// function generateRandomString(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         result += characters.charAt(randomIndex);
//     }
//
//     return result;
// }

// export function findParentsWithFlagKey(element, flagKey) {
//     const parents = [];
//     let e = element;
//     if (e.getAttribute(flagKey)) {
//         parents.push(e.getAttribute(flagKey))
//     }
//
//     function traverseUp(el) {
//         if (el.parentNode) {
//             const parent = el.parentNode;
//             if (parent?.getAttribute(flagKey)) {
//                 parents.push(parent.getAttribute(flagKey));
//             }
//             if (parent.tagName === 'BODY') {
//                 return;
//             }
//             traverseUp(parent);
//         }
//     }
//
//     traverseUp(e);
//     return parents;
// }

// export function findKeyByValue(obj, value, currentPath = '') {
//     for (const key in obj) {
//         const propertyPath = currentPath ? `${currentPath}.${key}` : key;
//
//         if (obj[key] === value) {
//             return propertyPath;
//         } else if (typeof obj[key] === 'object' && obj[key] !== null) {
//             const nestedKey = findKeyByValue(obj[key], value, propertyPath);
//             if (nestedKey) {
//                 return nestedKey;
//             }
//         }
//
//     }
//     return null;
// }


export async function translationI18n(text, lang) {
    let res = await axios.post('https://k7qfk5uewz.hk.aircode.run/hello', {
        text,
        lang
    })
    return res.data;
}

export function removeEmptyValues(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            removeEmptyValues(obj[key]); // 递归处理嵌套的对象
        } else if (obj[key] === '') {
            delete obj[key]; // 删除空字符串或 null 的值
        }
    }
}
