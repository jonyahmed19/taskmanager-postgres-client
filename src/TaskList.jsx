import React, {useState, useEffect} from 'react';
import {Table, Form, Input, Button, Space, DatePicker, Modal, message, Row, Col} from 'antd';
import Axiosinstance from './axiosInstance';
import moment from 'moment';
import dayjs from "dayjs";

const {Column} = Table;

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [finDate, setFinDate] = useState('');
    const [form] = Form.useForm();
    const [editingTask, setEditingTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await Axiosinstance.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (values) => {
        try {
            const hello = {
                ...values,
                finish_time: finDate
            };
            await Axiosinstance.post('/tasks', hello
            );
            form.resetFields();
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };
    const testDateHandle = (_, date) => {
        // form.setFieldValue('finish_time', date)
        console.log('alamgir', date);
        setFinDate(date)
    }
    const handleEdit = async (record) => {
        try {
            const response = await Axiosinstance.get(`/tasks/${record.id}`);


            const formattedTasks = {
                ...response.data,
                finish_time: dayjs(response.data.finish_time),
            };

            setFinDate(dayjs(response.data.finish_time))
            setEditingTask(formattedTasks);
            setIsEditing(true);
            form.setFieldsValue({
                name: response.data.name,
                description: response.data.description,
                finish_time: dayjs(response.data.finish_time)
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values) => {
        try {
            const hello = {
                ...values,
                finish_time: finDate
            };
            debugger;
            await Axiosinstance.put(`/tasks/${editingTask.id}`, hello);
            setIsEditing(false);
            form.resetFields();
            setEditingTask(null);
            fetchTasks();
            message.success('Task updated successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        form.resetFields();
        setEditingTask(null);
    };

    const handleDelete = async (id) => {
        try {

            await Axiosinstance.delete(`/tasks/${id}`);
            fetchTasks();
            message.success('Task deleted successfully');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{padding: '50px'}}>
            <h1>Task Manager</h1>
            <Row gutter={30}>

                <Col span={10}>

                    <Form
                        form={form}
                        onFinish={isEditing ? handleUpdate : handleCreate}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Task Name"
                            rules={[{required: true, message: 'Please enter a task name'}]}
                        >
                            <Input size={'large'}/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{required: true, message: 'Please enter a description'}]}
                        >
                            <Input.TextArea size={'large'} rows={4}/>
                        </Form.Item>
                        <Form.Item
                            name="finish_time"
                            label="Finish Time"
                            rules={[{required: true, message: 'Please select a finish time'}]}
                        >
                            <DatePicker
                                size={'large'}
                                style={{width: '100%'}}
                                onChange={testDateHandle} format="YYYY-MM-DD"/>

                            {/*<DatePicker  placeholder='Enter Test Result Date' size='large' onChange={testDateHandle} defaultValue={student?.tests?.ielts?.test_result_date ? dayjs(student?.tests?.ielts?.test_result_date) : ''} style={{ width: "100%" }} />*/}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {isEditing ? 'Update Task' : 'Add Task'}
                            </Button>
                            {isEditing && (
                                <Button onClick={handleCancelEdit} style={{marginLeft: '8px'}}>
                                    Cancel
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={14}>
                    <Table style={{paddingTop: '30px'}} dataSource={tasks} rowKey="id">
                        <Column title="Task Name" dataIndex="name" key="name"/>
                        <Column title="Description" dataIndex="description" key="description"/>
                        <Column title="Finish Time" dataIndex="finish_time" key="finish_time"/>
                        <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <Space size="small">
                                    <a onClick={() => handleEdit(record)}>Edit</a>
                                    <a onClick={() => handleDelete(record.id)}>Delete</a>
                                </Space>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default TaskList;
