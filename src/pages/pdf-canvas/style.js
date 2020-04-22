import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1224px;
  margin: 0 auto;
  padding: 1rem 0;
`;
export const PdfContainer = styled.div`
  border: 1px solid #b5b5b5;
`;

export const SidePdfview = styled.div`
  cursor: pointer;
  border: 1px solid #b5b5b5;
  box-sizing: border-box;
  margin-bottom: 2rem;

  p {
    padding: 5px;
    width: 10px;
    margin: 0;
    text-align: left;
    background: #e9e9e9;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-gap: 42px;
`;
export const MailList = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid green;
  border-radius: 4px;
  padding: 1rem;
  background: gray;
`;
export const UserMail = styled.div`
  background: teal;
  color: white;
  padding: 5px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 1.5rem;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  z-index: 10000;
`;
