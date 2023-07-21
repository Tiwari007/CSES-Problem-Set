// import { dataRootPath } from '../apps/budget/dataclass/DataClass';

const mixin = require('mixin-deep');

// const add_feature_link_to_component = (featureMap, componentMap) => {
//     console.log(`feature map ${featureMap} , componentmap ${componentMap}`);
//     Object.values(featureMap).forEach( feature => {
//         if (Array.isArray(feature['involved-components'])) {
//             feature['involved-components'].forEach( component_path => {
//                 let component = componentMap[component_path]
//                 if (component !== undefined) {
//                     component['_implement-features'].push(feature._docu_path);
//                 }
//                 else {
//                     console.warn(`${component_path} linked from ${feature._docu_path} not found`);
//                 }
//             })
//         }
//     })
// }




export class ProjectData {
    constructor() {
    }

    
    async getProjectData(repositoryInterface) {
        console.log("repositoryInterface", repositoryInterface);
        let data = { path: {} };
        let fileList = repositoryInterface.getFileList();
        console.log("repositoryInterfaceList", fileList);

        

        let modelName = '';
        
        // let project_metadata = fileList.find(fileElement => fileElement.fullPath == '/model.yaml');
        // if (project_metadata !== undefined) {
        //     const elementData = await repositoryInterface.getFileContent(project_metadata.fullPath);
        //     modelName = elementData.name || '';
        // }

        let featureMap = {};
        let componentMap = {};


        // what if we some how how extract the level one data from fileList and the store there response in dataa 
        // then after tat will loaded we wiull call a newly created function that will fetch rest of the api.

        // Let's try to extract the level one data
        // let take a variale levelOnedata

        
        // METHOD 1 : we can extract the root data first like files and folder name (skeleton) 
        // and in the background data will be comes slowly
        let homePage_data = fileList.filter(list => list.fullPath.length <= 40);
        let rest_data = fileList.filter(list => list.fullPath.length > 40 )
        console.log("home_pagedata", homePage_data);
        console.log("rest_data", rest_data);

        const perChunk = 200 // items per chunk    

        const inputArray = fileList
        
        const result = inputArray.reduce((resultArray, item, index) => { 
          const chunkIndex = Math.floor(index/perChunk)
        
          if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
          }
        
          resultArray[chunkIndex].push(item)
        
          return resultArray
        }, [])
        
        console.log("result",result);


        
        // METHOD 2 : either we can fetch the data in chuncks in some time based 
        // (but for this we need to figure out where is the root files)
        // also we need to go back from the length - 1
        // lety chunks = fileList.length - 1
        // this.getProjectDataApi(chunks - 100 to chunks, repositoryInterface, data)  1st iterayor;
        // chunk -= 100
        // let new_data = fileList.slice(2200, 2381)
        // console.log("new_data", new_data);

        await this.getProjectDataApi(homePage_data, repositoryInterface, data);






        // const newLocal = await Promise.all([].concat(fileList).map(async (fileElement) => {

        //     let fullPath = fileElement.fullPath;
        //     let parts = fullPath.split('/').slice(1);
        //     if (parts[0] === 'components' || parts[0] === 'features') {
        //         parts.unshift(modelName);
        //     }

        //     if (fullPath.endsWith('.yaml')) {
        //         if (parts.length >= 4 && parts.length <= 6 &&
        //             (parts[1] === 'components' || parts[1] === 'features')) {

        //             let elementName = parts[parts.length - 1];
        //             if ('component.yaml' !== elementName && 'feature.yaml' !== elementName) {
        //                 // Not a valid element. Components or features must have the format <ElementName>/component|feature.[json|yaml]>
        //                 console.warn(`${elementName} in ${fullPath} must be [component|feature].[json|yaml], skipping`);
        //                 return;
        //             }

        //             try {
        //                 const elementData = await repositoryInterface.getFileContent(fullPath);


        //                 if (elementData.type) {
        //                     // Not a valid element. Components or features must not have a type key
        //                     console.warn(`${elementName} in ${fullPath} must not have a 'type' key, skipping`);
        //                     return;
        //                 }

        //                 // add component path and full name
        //                 elementData._sha = fileElement.sha;
        //                 elementData._repository = fileElement.repository.__fullname;
        //                 elementData._reference = fileElement.reference;
        //                 elementData._full_path = fullPath;
        //                 elementData._repo_path = fileElement.repoPath;
        //                 elementData._docu_path = parts.slice(0, -1).join(process.env.REACT_APP_UNIQUE_ID_SEPARATOR);
        //                 elementData._name = parts[parts.length - 2];
        //                 elementData._metadata = undefined;

        //                 elementData.type = parts[1];

        //                 if ('feature.yaml' == elementName) {
        //                     featureMap[elementData._docu_path] = elementData;
        //                 } else if ('component.yaml' == elementName) {
        //                     elementData['_implement-features'] = [];
        //                     componentMap[elementData._docu_path] = elementData;
        //                 }

        //                 // Create a object tree based on the parts array and add elementData as leaf 
        //                 const result = parts.slice().reverse().reduce((res, key) => ({ [key]: res }), elementData);
        //                 data.path = mixin(data.path, result);

        //             } catch (error) {
        //                 console.error(`Cannot retrieve ${fullPath}: ${error}`);
        //             }
        //         }
        //     }
        //     else if (fullPath.endsWith('.md') || fullPath.endsWith('.hbs')) {
        //         try {
        //             let type = fullPath.endsWith('.md') ? 'markdown' : 'handlebars';
        //             const fileData = await repositoryInterface.getFileContent(fullPath);
        //             const result = parts.reverse().reduce((res, key) => ({ [key]: res }), { content: fileData, type: type });
        //             data.path = mixin(data.path, result);
        //         }
        //         catch (error) {
        //             console.error(`Cannot retrieve ${fullPath}: ${error}`);
        //         }
        //     }
        // }));

        // add_feature_link_to_component(featureMap, componentMap);


        console.log("data", data);
        // newLocal()
        return data;
    }

    async getProjectDataApi(homePage_data, repositoryInterface, data) {
        await Promise.all([].concat(homePage_data).map(async (ele) => {
            let fullPath = ele.fullPath;
            let parts = fullPath.split('/').slice(1);
            if (fullPath.endsWith('.md') || fullPath.endsWith('.hbs')) {
                try {
                    let type = fullPath.endsWith('.md') ? 'markdown' : 'handlebars';
                    const fileData = await repositoryInterface.getFileContent(fullPath);
                    const result = parts.reverse().reduce((res, key) => ({ [key]: res }), { content: fileData, type: type });
                    data.path = mixin(data.path, result);
                }
                catch (error) {
                    console.error(`Cannot retrieve ${fullPath}: ${error}`);
                }
            }
        }));
    }
}
