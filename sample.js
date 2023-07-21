import { useEffect, useState } from 'react';
import mixinDeep from 'mixin-deep';

export function ProjectData() {
  const [data, setData] = useState({ path: {} });
  const fileList = /* Replace this with the actual value */ [];

  useEffect(() => {
    getProjectData();
  }, []);

  const getProjectDataApi = async (homePage_data) => {
    await Promise.all(
      homePage_data.map(async (ele) => {
        const fullPath = ele.fullPath;
        const parts = fullPath.split('/').slice(1);
        if (fullPath.endsWith('.md') || fullPath.endsWith('.hbs')) {
          try {
            const type = fullPath.endsWith('.md') ? 'markdown' : 'handlebars';
            const fileData = await repositoryInterface.getFileContent(fullPath); // You need to replace repositoryInterface with the actual instance
            const result = parts.reduceRight((res, key) => ({ [key]: res }), { content: fileData, type: type });
            setData((prevData) => ({ path: mixinDeep(prevData.path, result) }));
          } catch (error) {
            console.error(`Cannot retrieve ${fullPath}: ${error}`);
          }
        }
      })
    );
  };

  const getProjectData = async () => {
    console.log("repositoryInterface", repositoryInterface);
    const homePage_data = fileList.filter((list) => list.fullPath.length <= 40);
    const rest_data = fileList.filter((list) => list.fullPath.length > 40);
    console.log("home_pagedata", homePage_data);
    console.log("rest_data", rest_data);

    const perChunk = 200; // items per chunk
    const result = fileList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    console.log("result", result);

    await getProjectDataApi(homePage_data);
    console.log("data", data);
    // newLocal()
    // return data; // If you want to return data, consider using it in a state or a callback, not directly from here.
  };

  return null; // Replace this with your actual JSX component.
}
