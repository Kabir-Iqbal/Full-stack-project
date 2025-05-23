
import ReactQuill from "react-quill";
// import Quill snow theme
import "react-quill/dist/quill.snow.css";
import './styles/ReactQuill.css'; // Import the separate CSS file

// define props interface type for editor
interface Props {
  value: string;
  onChange: (content: string) => void;
}

// create functional ReactQuillComponent for ReactQuill 
const ReactQuillComponent : React.FC<Props> = ({ value, onChange })=> {

    //  define custom color palette
  const myColors = [
    "purple",
    "#785412",
    "#452632",
    "#856325",
    "#963254",
    "#254563",
    "white"
  ];
   
   
// set up toolbar modules for ReactQuill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: myColors }],
      [{ background: myColors }]
    ]
  };

//   define allowed content formats for the ReactQuill editor
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align"
  ];


 
  return (
    // Final Ui
    <>
    <div className="my-quill-wrapper">
      {/* used ReactQuill for editor data content */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="bg-gray-700 text-white rounded-md border border-gray-600"
        placeholder="Write your article content here..."
      />
      </div>
      
    </>
  );
}

// export ReactQuillComponent;
export default ReactQuillComponent