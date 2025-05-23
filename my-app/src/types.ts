

export interface Article {
  _id: string;
  title: string;
  category: string;
  body: string;
  author: { _id: string; username: string }; // _id add kiya
  status: string;
  createdAt: string;
  updatedAt: string;
}