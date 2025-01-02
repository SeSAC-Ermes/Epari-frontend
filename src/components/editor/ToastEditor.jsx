import { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

function ToastEditor({ content, onChange, onImageUpload }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(content || '');

      // 파이 차트 커맨드
      editorInstance.addCommand('markdown', 'insertPieChart', () => {
        const chartData = {
          type: "pie",
          data: [
            { label: "Category A", value: 30 },
            { label: "Category B", value: 20 },
            { label: "Category C", value: 50 }
          ]
        };

        // 차트를 HTML로 변환
        const container = document.createElement('div');
        const chartPlugin = new D3ChartPlugin();
        chartPlugin.initChart(container, chartData.type, chartData.data);

        // HTML 삽입
        editorInstance.insertText(container.outerHTML);
      });

      // 막대 차트 커맨드
      editorInstance.addCommand('markdown', 'insertBarChart', () => {
        const chartData = {
          type: "bar",
          data: [
            { label: "A", value: 30 },
            { label: "B", value: 45 },
            { label: "C", value: 25 }
          ]
        };

        const container = document.createElement('div');
        const chartPlugin = new D3ChartPlugin();
        chartPlugin.initChart(container, chartData.type, chartData.data);

        editorInstance.insertText(container.outerHTML);
      });

      // 라인 차트 커맨드
      editorInstance.addCommand('markdown', 'insertLineChart', () => {
        const chartData = {
          type: "line",
          data: [
            { label: "Jan", value: 10 },
            { label: "Feb", value: 20 },
            { label: "Mar", value: 15 },
            { label: "Apr", value: 25 }
          ]
        };

        const container = document.createElement('div');
        const chartPlugin = new D3ChartPlugin();
        chartPlugin.initChart(container, chartData.type, chartData.data);

        editorInstance.insertText(container.outerHTML);
      });

      // 차트 렌더링을 위한 커스텀 코드블록 설정
      editorInstance.addHook('addImageBlobHook', handleImageUpload);

      // 마크다운 변경 감지
      editorInstance.addHook('change', () => {
        const markdown = editorInstance.getMarkdown();
        onChange(markdown);
      });
    }
  }, [content]);

  const handleChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdown = editorInstance.getMarkdown();
      onChange(markdown);
    }
  };

  const handleImageUpload = async (file, callback) => {
    try {
      const s3Client = new S3Client({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        }
      });

      const fileName = `images/${uuidv4()}-${file.name}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type
      }));

      const imageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`;

      onImageUpload(imageUrl);

      callback(imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      callback('');
    }
  };

  return (
      <div className="min-h-[400px]">
        <Editor
            ref={editorRef}
            initialValue=""
            previewStyle="vertical"
            height="400px"
            initialEditType="markdown"
            useCommandShortcut={true}
            onChange={handleChange}
            hideModeSwitch={true}
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'image', 'link'],
              ['code', 'codeblock'],
              [
                {
                  name: 'piechart',
                  className: 'toastui-editor-custom-button',
                  tooltip: 'Insert Pie Chart',
                  text: 'Pie Chart',
                  command: 'insertPieChart'
                },
                {
                  name: 'barchart',
                  className: 'toastui-editor-custom-button',
                  tooltip: 'Insert Bar Chart',
                  text: 'Bar Chart',
                  command: 'insertBarChart'
                },
                {
                  name: 'linechart',
                  className: 'toastui-editor-custom-button',
                  tooltip: 'Insert Line Chart',
                  text: 'Line Chart',
                  command: 'insertLineChart'
                }
              ]
            ]}
            hooks={{
              addImageBlobHook: handleImageUpload
            }}
        />
      </div>
  );
}

export default ToastEditor; 
