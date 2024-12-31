import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from './App'

describe('ToDoアプリ', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.getItem.mockReturnValue(null)
  })

  it('アプリケーションのタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('ToDo List')).toBeInTheDocument()
  })

  it('フォームから新しいToDoを追加できる', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a new todo')
    const submitButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: '新しいToDo' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('新しいToDo')).toBeInTheDocument()
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('チェックボックスをクリックしてToDoの完了状態を切り替えられる', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a new todo')
    const submitButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: 'テストToDo' } })
    fireEvent.click(submitButton)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const todoItem = screen.getByText('テストToDo').closest('.todo-item')
    expect(todoItem).toHaveClass('completed')
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('削除ボタンをクリックしてToDoを削除できる', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a new todo')
    const submitButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: '削除するToDo' } })
    fireEvent.click(submitButton)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(screen.queryByText('削除するToDo')).not.toBeInTheDocument()
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('初期表示時にlocalStorageからToDoを読み込める', () => {
    const savedTodos = [
      { id: 1, text: '保存済みToDo', completed: false }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(savedTodos))

    render(<App />)
    expect(screen.getByText('保存済みToDo')).toBeInTheDocument()
  })

  it('空のToDoは追加できない', () => {
    render(<App />)
    const submitButton = screen.getByText('Add')

    fireEvent.click(submitButton)
    const todos = screen.queryAllByRole('listitem')
    expect(todos).toHaveLength(0)
  })

  it('ToDoの前後の空白は削除される', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a new todo')
    const submitButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: '  前後の空白を削除  ' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('前後の空白を削除')).toBeInTheDocument()
  })
})