#ifndef MINIGIT_HPP
#define MINIGIT_HPP

#include <string> 
using namespace std;


struct doublyNode
{
    int commitNumber;//
    struct singlyNode * head;
    doublyNode * previous;
    doublyNode * next;
    doublyNode * father;//doubly node head
}; 

struct singlyNode
{
    string fileName; // Name of local file
    string fileVersion; // Name of file in .minigit folder
    singlyNode * next;
};


class myClass{
    private:
        // head of the single list
        singlyNode * head;//=NULL
        doublyNode * father;
        int commitCounter;
        
        //functions 
    public:
        myClass();//constructor
        // ~myClass();
        void addFiles();
        void removeFiles();
        void commit();
        void checkout();
        void initialize();
        void showList();
        // void doublyMaker();
};

#endif