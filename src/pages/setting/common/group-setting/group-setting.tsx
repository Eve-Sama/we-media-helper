import { Form, Input, List, Modal, Popconfirm, Select, Tag } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './style.module.scss';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
const { Option } = Select;

export interface Group {
  label: string;
  cardList: string[];
  uuid: string;
}

export interface GroupSettingRef {
  getData: () => Group[];
  /**
   * @todo 遇到个场景问题, 暂时不知道怎么解决.
   * GroupSetting 通过 props 拿到了 groupList, 再创建了一个 state groupListData. 之后在本组件内无论怎么操作, 修改的都是 groupListData 而不是 groupList.
   * 那么当父组件想要重置 groupList 的时候, 好像只能通过手动调用子组件方法来重置.
   */
  setGroupListData: React.Dispatch<React.SetStateAction<Group[]>>;
}

interface GroupSettingProps {
  cardList: Array<{ label: string; value: string }>;
  groupList: Group[];
}

export const GroupSetting = forwardRef<GroupSettingRef, GroupSettingProps>((props, ref) => {
  const { cardList, groupList } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupListData, setGroupListData] = useState(groupList);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>();
  const [form] = Form.useForm();

  const children: React.ReactNode[] = [];
  cardList.forEach(v => {
    children.push(<Option key={v.value}>{v.label}</Option>);
  });

  useImperativeHandle(ref, () => ({
    getData,
    setGroupListData,
  }));

  const getData = () => {
    return groupListData;
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((group: Group) => {
        const target = groupListData.find(v => v.uuid === group.uuid);
        if (target) {
          Object.assign(target, group);
          setGroupListData(groupListData);
        } else {
          setGroupListData([...groupListData, group]);
        }
        setIsModalOpen(false);
      })
      .catch(v => v);
  };

  const initTagListComponent = () => {
    const components: JSX.Element[] = [];
    groupListData.forEach((item, groupIndex) => {
      const tagContent = item.cardList.map((card, cardIndex) => (
        <Tag key={cardIndex} className={styles['tag']}>
          {cardList.find(v => v.value === card).label}
        </Tag>
      ));
      components.push(
        <List.Item key={groupIndex}>
          <div className={styles['tag-label']}>
            <span>{item.label}</span>
            <div className={styles['tag-setting']}>
              <Popconfirm title="确认要删除吗?" okText="确定" cancelText="取消" onConfirm={() => deleteGroup(item.uuid)}>
                <a>删除</a>
              </Popconfirm>
              <a onClick={() => editGroup(item.uuid)}>编辑</a>
            </div>
          </div>
          <div className={styles['tag-container']}>{tagContent}</div>
        </List.Item>,
      );
    });
    return components;
  };

  const deleteGroup = (uuid: string) => {
    const temp = [...groupListData];
    _.remove(temp, v => v.uuid === uuid);
    setGroupListData(temp);
  };

  const editGroup = (uuid: string) => {
    form.resetFields();
    let target = groupListData.find(v => v.uuid === uuid);
    if (target) {
      setModalAction('edit');
    } else {
      target = {
        label: '',
        cardList: [],
        uuid,
      };
      setModalAction('add');
    }
    setIsModalOpen(true);
    form.setFieldsValue(target);
  };

  const cardListValidator = (_rule, value: string[] = []) => {
    return new Promise<void>((resolve, reject) => {
      if (value.length > 0) {
        resolve();
      } else {
        reject('至少选择一个卡片');
      }
    });
  };

  return (
    <div className={styles['container']}>
      <Modal title={modalAction === 'add' ? '新建分组' : '编辑分组'} maskClosable={false} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="确认" cancelText="取消">
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item label="分组名" name="label" rules={[{ required: true, message: '分组名不可为空' }]}>
            <Input placeholder="请输入分组名" />
          </Form.Item>
          <Form.Item label="uuid" name="uuid" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="卡片列表" name="cardList" rules={[{ required: true, validator: cardListValidator }]}>
            <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择卡片">
              {children}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <List itemLayout="vertical" bordered footer={<a onClick={() => editGroup(uuidv4())}>添加</a>} dataSource={initTagListComponent()} renderItem={v => v} />
    </div>
  );
});
