import styled from '@emotion/styled';

export const ContainerStyle = styled.div`
  .bilibili-container {
    padding: 24px;
    border-radius: 2px;
    background: #fff;
    .line-1 {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      div:nth-of-type(1) {
        .container {
          margin-left: 0;
        }
      }
      div:nth-last-of-type(1) {
        .container {
          margin-right: 0;
        }
      }
    }
    .line-2 {
      display: flex;
      justify-content: space-between;
      div:nth-of-type(1) {
        .container {
          margin-left: 0;
        }
      }
      div:nth-last-of-type(1) {
        .container {
          margin-right: 0;
        }
      }
    }
  }
`;
