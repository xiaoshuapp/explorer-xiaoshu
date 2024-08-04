import originData from './data.json'

export default function useListData() {
  const listData = ref(originData)

  const changeTitle = (index: number): void => {
    const name = prompt('组名称', listData.value[index].name)
    if (name) {
      const icon = prompt('Emoji', listData.value[index].icon || '😀')
      listData.value[index].icon = icon || '😀'
      listData.value[index].name = name
    }
  }

  const addEngine = (index: number): void => {
    const name = prompt('搜索引擎名称')
    if (name) {
      const engine = prompt('URL（比如：https://bing.com/search?q=%s，需要带%s）')
      if (engine) {
        listData.value[index].list.push({
          name,
          engine,
        })
      }
    }
  }

  const addToList = (data: { name: string; engine: string }): void => {
    listData.value[0].list.push(data);
  };

  // 将当前搜索引擎的分组置顶
  const setFirst = (index: number): void => {
    const first = listData.value.splice(index, 1)
    listData.value.unshift(first[0])
  }

  const addGroup = (): void => {
    listData.value.unshift({
      icon: '😀',
      name: 'New Group',
      list: [],
    })
  }

  const deleteGroup = (index: number): void => {
    if (window.confirm('真的要删除该分组吗？')) listData.value.splice(index, 1)
  }

  const deleteEngine = (index: number, elementNow: any): void => {
    if (window.confirm(`真的要删除“${elementNow.name}”吗？`)) {
      const index2 = listData.value[index].list.findIndex((element) => {
        return element === elementNow
      })
      listData.value[index].list.splice(index2, 1)
    }
  }

  const changeEngine = (index: number, elementNow: any): void => {
    const name = prompt('搜索引擎名称', elementNow.name)
    if (name) {
      const engine = prompt('URL（比如：https://bing.com/search?q=%s，需要带%s）', elementNow.engine)
      if (engine) {
        const index2 = listData.value[index].list.findIndex((element) => {
          return element === elementNow
        })
        listData.value[index].list[index2].name = name || elementNow.name
        listData.value[index].list[index2].engine = engine || elementNow.engine
      }
    }
  }

  watch(
    listData,
    () => {
      const data = JSON.parse(JSON.stringify(listData.value))
      browser.storage.sync.set({ listData: data }).then(
        () => {
          window.console.log('Watching listData Done')
        },
        (error: Error) => {
          window.console.log(error)
        }
      )
    },
    {
      deep: true,
    }
  )

  return {
    listData,
    changeTitle,
    addEngine,
    addToList,
    setFirst,
    addGroup,
    deleteGroup,
    deleteEngine,
    changeEngine
  };
}