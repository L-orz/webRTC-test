import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { FC, useState } from 'react'

interface Props {
  handleSend: (file: File) => void
}

const Send: FC<Props> = (props) => {
  const [files, setFiles] = useState<any[]>([])
  const uploadProps = {
    onRemove: (file: any) => {
      setFiles((_files) => {
        const index = _files.indexOf(file)
        const newFiles = _files.slice()
        newFiles.splice(index, 1)
        return newFiles
      })
    },
    beforeUpload: (file: any) => {
      setFiles((_files) => [..._files, file])
      return false
    },
    fileList: files,
  }

  const handleClick = () => {
    // console.log(files)
    files.forEach((file) => {
      props.handleSend(file)
      // const reader = new FileReader()
      // reader.readAsArrayBuffer(file)
      // reader.onload = evt => {
      //   // console.log(evt.target?.result)

      //   // const newFile = new File([evt!.target!.result!], file.name, {type: 'blob'})
      //   // downloadFile(newFile, file.name)
      // }
    })
  }

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button type="primary" onClick={handleClick}>
        发送
      </Button>
    </>
  )
}

export default Send
