import styled from '@emotion/styled';

export const ContainerStyle = styled.div`
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 221px;
    height: 88px;
    padding: 16px 16px 20px 16px;
    margin: 0px 8px 0px;
    border-radius: 16px;
    color: #61666d;
    background-color: rgba(0, 174, 236, 0.04);
    box-sizing: border-box;
    .header {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .change-value {
        color: #ff4684;
        font-weight: 500;
      }
    }
    .total-value {
      color: #00aeec;
      font-weight: 800;
      font-size: 22px;
    }
  }
`;
