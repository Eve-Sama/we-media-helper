import { Form, Input, InputNumber, List, Modal, Popconfirm, Select, Tag } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './style.module.scss';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { GroupSettingRef, Group, GroupSettingProps } from './group.interface';
import { combileArrayBy } from '../../../../common/utils-function';
const { Option, OptGroup } = Select;

export const GroupSetting = forwardRef<GroupSettingRef, GroupSettingProps>((props, ref) => {
  const { cardGroupList, groupList } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupListData, setGroupListData] = useState(groupList);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>();
  const [form] = Form.useForm();
  const dataCardList = combileArrayBy(cardGroupList, 'children');

  const groupElementList: React.ReactNode[] = [];
  cardGroupList.forEach(group => {
    const childElementList: React.ReactNode[] = [];
    group.children.forEach(child => childElementList.push(<Option key={child.value}>{child.label}</Option>));
    groupElementList.push(
      <OptGroup key={group.group} label={group.group}>
        {childElementList}
      </OptGroup>,
    );
  });

  useEffect(function checkCardGroupValid() {
    const invalid = dataCardList.some(card => dataCardList.filter(v => v.value === card.value).length > 1);
    if (invalid) {
      throw new Error(`The input variable 'cardGroupList' exist duplicate type in different 'cardList'!`);
    }
  }, []);

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
        // cardList 在本地存储中是对象数组, 但是在表单中是个字符串数组
        const cardList = group.cardList as unknown as string[];
        if (target) {
          const tempCardList = (group.cardList as unknown as string[]).map(v => {
            const typeTarget = target.cardList.find(card => card.type === v);
            return typeTarget || { type: v, notify: false };
          });
          group.cardList = tempCardList;
          Object.assign(target, group);
          setGroupListData(groupListData);
        } else {
          const tempCardList = cardList.map(v => ({ type: v, notify: false }));
          setGroupListData([...groupListData, { ...group, cardList: tempCardList }]);
        }
        setIsModalOpen(false);
      })
      .catch(v => v);
  };

  /**
   * 切换卡片通知状态
   * @param uuid 分组的 uuid
   * @param type 卡片类型
   */
  const toggleNotify = (uuid: string, type: string) => {
    const group = groupListData.find(v => v.uuid === uuid);
    const card = group.cardList.find(v => v.type === type);
    card.notify = !card.notify;
    setGroupListData([...groupListData]);
  };

  const initTagListComponent = () => {
    const components: JSX.Element[] = [];
    groupListData.forEach((item, groupIndex) => {
      const tagContent = item.cardList.map((card, cardIndex) => (
        <Tag key={cardIndex} className={styles['tag']} onClick={() => toggleNotify(item.uuid, card.type)}>
          <span>{dataCardList.find(v => v.value === card.type).label}</span>
          <span className={styles['notify']} style={{ background: card.notify ? '#87d068' : 'gray' }}></span>
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
        columnNum: null,
      };
      setModalAction('add');
    }
    setIsModalOpen(true);
    form.setFieldsValue({ ...target, cardList: target.cardList.map(v => v.type) });
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
            <Input placeholder="区分不同组的标题" />
          </Form.Item>
          <Form.Item label="uuid" name="uuid" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="卡片列表" name="cardList" rules={[{ required: true, validator: cardListValidator }]}>
            <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="每个数据统计类别都是独立的卡片">
              {groupElementList}
            </Select>
          </Form.Item>
          <Form.Item label="单行卡片数" name="columnNum" rules={[{ required: true, message: '卡片数不可为空' }]}>
            <InputNumber<string> style={{ width: '100%' }} min="1" max="10" precision={0} placeholder="每行分成多少列" />
          </Form.Item>
        </Form>
      </Modal>

      <List itemLayout="vertical" bordered footer={<a onClick={() => editGroup(uuidv4())}>添加</a>} dataSource={initTagListComponent()} renderItem={v => v} />
    </div>
  );
});
